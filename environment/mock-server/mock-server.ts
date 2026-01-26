import * as fs from "fs"
import * as http from "http"
import { IncomingMessage, ServerResponse } from "http"
import * as https from "https"
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
  headers: Record<string, any>
  body: any
}

interface MockEndpoint {
  method: string
  path: string
  response: { status: number; body: any; headers?: Record<string, string> }
  hits: number
  count?: number
  request?: RequestDetails[] // Stores the request details that consumed this mock.
}

const MOCKS: MockEndpoint[] = []
const REQUEST_LOG: { timestamp: string; method: string; path: string; status: number; note: string }[] = []

// --- HELPERS ---

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
  // GET /requests (Logs)
  if (pathname === "/requests" && req.method === "GET") {
    logRequest(req, 200, "View Logs")
    sendJSON(res, 200, REQUEST_LOG)
    return true
  }

  // POST /clear (Reset state)
  if (pathname === "/clear" && req.method === "POST") {
    MOCKS.length = 0
    REQUEST_LOG.length = 0
    logRequest(req, 200, "Server State Cleared")
    sendJSON(res, 200, { message: "Mocks and Request Log have been cleared." })
    return true
  }

  // /mocks Endpoint
  if (pathname === "/mocks") {
    if (req.method === "GET") {
      logRequest(req, 200, "View Mocks")
      sendJSON(res, 200, MOCKS)
      return true
    }

    if (req.method === "POST") {
      const body = await parseBody(req)

      if (!body.method || !body.path || !body.response?.status) {
        logRequest(req, 400, "Invalid Mock Definition")
        sendJSON(res, 400, { error: "Missing required fields: method, path, response.status" })
        return true
      }

      const method = body.method.toUpperCase()

      // Duplicates are allowed. Mocks are matched FIFO.
      MOCKS.push({ ...body, method, hits: 0, count: body.count })
      logRequest(req, 201, `Added Mock: ${method} ${body.path} Count:${body.count}`)
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
  // Find the FIRST (oldest) mock that matches method/path AND is unused (hits < count).
  const mock = MOCKS.find((m) => m.method === req.method && m.path === pathname && (!m.count || m.hits < m.count))

  if (!mock) {
    // Log/respond with 404 if an expired mock was found
    const expiredMock = MOCKS.find(
      (m) => m.method === req.method && m.path === pathname && m.count && m.hits >= m.count
    )
    if (expiredMock) {
      logRequest(req, 404, "Mock Expired (Hit Limit Reached)")
      sendJSON(res, 404, {
        error: "Endpoint found, but mock has expired (one-time use limit reached).",
        path: pathname
      })
      return true
    }
    return false
  }

  mock.hits++

  // Capture Request Details and store it in the mock
  const requestBody = await parseBody(req)
  mock.request ??= []
  mock.request.push({
    method: req.method || "UNKNOWN",
    path: pathname,
    // Clone headers to prevent issues with Node's Headers object
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
