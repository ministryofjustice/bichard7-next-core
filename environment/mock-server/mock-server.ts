import * as fs from "fs"
import * as http from "http"
import { IncomingMessage, ServerResponse } from "http"
import * as https from "https"
import path from "path"
import * as url from "url"

// --- CONFIGURATION ---
const CONFIG = {
  // Read from environment variables, defaulting to 8081 if not present.
  HTTP_PORT: parseInt(process.env.HTTP_PORT || "8081", 10),
  // Read from environment variables, defaulting to 8443 if not present.
  HTTPS_PORT: parseInt(process.env.HTTPS_PORT || "8443", 10),
  // HTTPS is enabled by default unless explicitly set to 'false'.
  HTTPS_ENABLED: process.env.HTTPS_ENABLED === "false" ? false : true
}

// --- STATE ---

interface RequestDetails {
  method: string
  path: string
  timestamp: string
  headers: Record<string, any>
  body: any
}

interface MockEndpoint {
  method: string
  path: string
  requestBody?: any
  response: { status: number; body: any; headers?: Record<string, string> }
  hits: number
  count?: number
  request?: RequestDetails[]
}

const MOCKS: MockEndpoint[] = []
const REQUEST_LOG: { timestamp: string; method: string; path: string; status: number; note: string }[] = []

// --- HELPERS ---

/**
 * Recursively checks if the 'actual' object contains at least
 * all fields and values defined in the 'expected' object.
 */
const isPartialMatch = (expected: any, actual: any): boolean => {
  // If no expected body is defined for the mock, it's a match
  if (expected === undefined || expected === null) return true

  // If expected is a primitive, perform direct comparison
  if (typeof expected !== "object" || expected === null) {
    return expected === actual
  }

  // If actual is not an object but expected is, it's not a match
  if (typeof actual !== "object" || actual === null) {
    return false
  }

  // Ensure every key in expected exists in actual and matches recursively
  return Object.keys(expected).every((key) => {
    return isPartialMatch(expected[key], actual[key])
  })
}

/**
 * Utility to send JSON responses with standard headers.
 */
const sendJSON = (res: ServerResponse, status: number, data: any, headers: Record<string, string> = {}) => {
  const json = JSON.stringify(data, null, 2)
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(json),
    "Access-Control-Allow-Origin": "*", // Enable CORS
    ...headers
  })
  res.end(json)
}

/**
 * Utility to parse JSON body from incoming request.
 */
const parseBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve) => {
    let body = ""
    req.on("data", (chunk) => (body += chunk))
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        resolve({})
      }
    })
  })
}

/**
 * Centralized logging for all requests.
 */
const logRequest = (req: IncomingMessage, status: number, note: string = "") => {
  const protocol = (req.socket as any).encrypted ? "HTTPS" : "HTTP"
  const entry = {
    timestamp: new Date().toISOString(),
    method: req.method || "UNKNOWN",
    path: req.url || "UNKNOWN",
    status,
    note
  }
  REQUEST_LOG.push(entry)
  console.log(`[${protocol}] ${entry.method} ${entry.path} -> ${status} ${note ? `(${note})` : ""}`)
}

// --- ROUTE HANDLERS ---

/**
 * Handles control endpoints: /requests, /clear, and /mocks.
 */
const handleControlRoutes = async (req: IncomingMessage, res: ServerResponse, pathname: string): Promise<boolean> => {
  // Parse query parameters
  const parsedUrl = url.parse(req.url || "", true)

  // GET /requests (Logs)
  if (pathname === "/requests" && req.method === "GET") {
    sendJSON(res, 200, REQUEST_LOG)
    return true
  }

  // POST /clear (Reset state)
  if (pathname === "/clear" && req.method === "POST") {
    MOCKS.length = 0
    REQUEST_LOG.length = 0
    sendJSON(res, 200, { message: "Mocks and Request Log have been cleared." })
    return true
  }

  // /mocks Endpoint
  if (pathname === "/mocks") {
    if (req.method === "GET") {
      const parsedUrl = url.parse(req.url || "", true)
      const isJsonRequest = parsedUrl.query.output === "json"

      if (isJsonRequest) {
        sendJSON(res, 200, MOCKS)
      } else {
        try {
          // Resolve the path to your HTML file
          const htmlPath = path.join(process.cwd(), "mock-server.html")
          const htmlContent = fs.readFileSync(htmlPath, "utf-8")

          res.writeHead(200, { "Content-Type": "text/html" })
          res.end(htmlContent)
        } catch (err) {
          res.writeHead(500, { "Content-Type": "text/plain" })
          res.end("Error: Could not find mock-server.html in the server directory.")
        }
      }
      return true
    }

    if (req.method === "POST") {
      const body = await parseBody(req)
      if (!body.method || !body.path || !body.response?.status) {
        sendJSON(res, 400, { error: "Missing required fields: method, path, response.status" })
        return true
      }
      const method = body.method.toUpperCase()
      MOCKS.push({ ...body, method, hits: 0, count: body.count })
      sendJSON(res, 201, { message: "Mock created (duplicates allowed)", count: body.count })
      return true
    }
  }
  return false
}

/**
 * Checks against defined MOCKS. Returns true if handled.
 */
const handleMockRoutes = async (req: IncomingMessage, res: ServerResponse, pathname: string): Promise<boolean> => {
  // Parse body first so we can use it for matching
  const requestBody = await parseBody(req)

  // Find the FIRST mock matching method, path, hit count, AND partial body
  const mock = MOCKS.find(
    (m) =>
      m.method === req.method &&
      m.path === pathname &&
      (!m.count || m.hits < m.count) &&
      isPartialMatch(m.requestBody, requestBody)
  )

  if (!mock) {
    // Check if an expired mock matches this specific request (including body)
    const expiredMock = MOCKS.find(
      (m) =>
        m.method === req.method &&
        m.path === pathname &&
        m.count &&
        m.hits >= m.count &&
        isPartialMatch(m.requestBody, requestBody)
    )

    if (expiredMock) {
      logRequest(req, 404, "Mock Expired (Hit Limit Reached)")
      sendJSON(res, 404, {
        error: "Endpoint found, but mock has expired.",
        path: pathname
      })
      return true
    }
    return false
  }

  mock.hits++

  // Store the actual request that matched
  mock.request ??= []
  mock.request.push({
    method: req.method || "UNKNOWN",
    timestamp: new Date().toLocaleString(),
    path: pathname,
    headers: structuredClone(req.headers),
    body: requestBody
  })

  logRequest(req, mock.response.status, "Mock Served")
  sendJSON(res, mock.response.status, mock.response.body, mock.response.headers)
  return true
}

// --- MAIN SERVER LISTENER ---

const requestHandler = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { pathname } = url.parse(req.url || "/", true)
    const path = pathname || "/"

    if (await handleControlRoutes(req, res, path)) return

    // This handles serving the mock OR responding with 404 if expired
    if (await handleMockRoutes(req, res, path)) return

    // 404 Not Found (Only reached if no mock/control route matched and handleMockRoutes returned false)
    logRequest(req, 404, "Not Found")
    sendJSON(res, 404, { error: "Endpoint not found", path })
  } catch (err) {
    console.error("Server Error:", err)
    sendJSON(res, 500, { error: "Internal Server Error" })
  }
}

// --- SERVER STARTUP ---

const startServer = () => {
  console.log("--- Simple Mock Server ---")
  console.log(`> HTTP Configuration: Port ${CONFIG.HTTP_PORT}`)
  console.log(`> HTTPS Configuration: Port ${CONFIG.HTTPS_PORT}, Enabled: ${CONFIG.HTTPS_ENABLED}`)

  // Start HTTP
  http.createServer(requestHandler).listen(CONFIG.HTTP_PORT, () => {
    console.log(`> HTTP Running:  http://localhost:${CONFIG.HTTP_PORT}`)
  })

  // Start HTTPS (if enabled)
  if (CONFIG.HTTPS_ENABLED) {
    try {
      const options = {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem")
      }

      https.createServer(options, requestHandler).listen(CONFIG.HTTPS_PORT, () => {
        console.log(`> HTTPS Running: https://localhost:${CONFIG.HTTPS_PORT}`)
      })
    } catch (error) {
      console.error("Error loading SSL certificates (key.pem or cert.pem).")
      console.error("Please ensure they are generated in the current directory using the run.sh script.")
      console.error(error)
    }
  } else {
    console.log(`> HTTPS Disabled (Set HTTPS_ENABLED=true to enable)`)
  }

  console.log(
    "> Usage: POST /mocks to add (duplicates allowed), GET /mocks to view, GET /requests to see log, POST /clear to reset"
  )
}

startServer()
