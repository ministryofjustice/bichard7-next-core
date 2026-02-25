import { randomUUID } from "crypto" // Added for ID generation
import * as fs from "fs"
import * as http from "http"
import { IncomingMessage, ServerResponse } from "http"
import * as https from "https"
import path from "path"
import * as url from "url"

// --- CONFIGURATION ---
const CONFIG = {
  HTTP_PORT: parseInt(process.env.HTTP_PORT || "8081", 10),
  HTTPS_PORT: parseInt(process.env.HTTPS_PORT || "8443", 10),
  HTTPS_ENABLED: process.env.HTTPS_ENABLED === "false" ? false : true
}

// --- STATE ---

interface RequestDetails {
  id: string
  method: string
  path: string
  timestamp: string
  headers: Record<string, any>
  body: any
  status?: number // Added to capture the response status for the UI
  mock?: MockEndpoint | string
}

interface MockEndpoint {
  id: string // Added ID
  method: string
  path: string
  requestBody?: any
  response: { status: number; body: any; headers?: Record<string, string> }
  hits: number
  count?: number
  requests: string[] // Changed from request to requests (Array of IDs)
}

const MOCKS: MockEndpoint[] = []
const REQUEST_LOG: RequestDetails[] = [] // Unified request log

// --- HELPERS ---

const isPathEqual = (pathA: string, pathB: string): boolean => {
  const normalize = (p: string) => p.replace(/^\/+/, "")
  return normalize(pathA) === normalize(pathB)
}

const isPartialMatch = (expected: any, actual: any): boolean => {
  if (expected === undefined || expected === null) return true
  if (typeof expected !== "object" || expected === null) return expected === actual
  if (typeof actual !== "object" || actual === null) return false
  return Object.keys(expected).every((key) => isPartialMatch(expected[key], actual[key]))
}

const sendJSON = (res: ServerResponse, status: number, data: any, headers: Record<string, string> = {}) => {
  const json = JSON.stringify(data, null, 2)
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(json),
    "Access-Control-Allow-Origin": "*",
    ...headers
  })
  res.end(json)
}

const serveHTML = (res: ServerResponse, fileName: string) => {
  try {
    const htmlPath = path.join(process.cwd(), fileName)
    const htmlContent = fs.readFileSync(htmlPath, "utf-8")
    res.writeHead(200, { "Content-Type": "text/html" })
    res.end(htmlContent)
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" })
    res.end(`Error: Could not find ${fileName} in the server directory.`)
  }
}

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

// --- ROUTE HANDLERS ---

const handleControlRoutes = async (req: IncomingMessage, res: ServerResponse, pathname: string): Promise<boolean> => {
  const parsedUrl = url.parse(req.url || "", true)

  // /requests Endpoint
  if (pathname === "/requests" && req.method === "GET") {
    if (parsedUrl.query.output === "json") {
      // Map requests to include full mock objects instead of just IDs
      const populatedRequests = REQUEST_LOG.map((reqLog) => ({
        ...reqLog,
        mock: MOCKS.find((m) => m.id === reqLog.mock) || null
      }))
      sendJSON(res, 200, populatedRequests)
    } else {
      serveHTML(res, "mock-server-requests.html")
    }
    return true
  }

  if (pathname === "/clear" && req.method === "POST") {
    MOCKS.length = 0
    REQUEST_LOG.length = 0
    sendJSON(res, 200, { message: "State cleared." })
    return true
  }

  if (pathname === "/mocks") {
    if (req.method === "GET") {
      if (parsedUrl.query.output === "json") {
        // Map mocks to include full request objects instead of just IDs
        const populatedMocks = MOCKS.map((mock) => ({
          ...mock,
          request: REQUEST_LOG.filter((r) => mock.requests.includes(r.id))
        }))
        sendJSON(res, 200, populatedMocks)
      } else {
        serveHTML(res, "mock-server-mocks.html")
      }
      return true
    }

    if (req.method === "POST") {
      const body = await parseBody(req)
      if (!body.method || !body.path || !body.response?.status) {
        sendJSON(res, 400, { error: "Missing required fields" })
        return true
      }
      const newMock: MockEndpoint = {
        ...body,
        id: randomUUID(),
        method: body.method.toUpperCase(),
        hits: 0,
        requests: []
      }
      MOCKS.push(newMock)
      sendJSON(res, 201, { message: "Mock created", id: newMock.id })
      return true
    }
  }
  return false
}

const handleMockRoutes = async (req: IncomingMessage, res: ServerResponse, pathname: string): Promise<boolean> => {
  const requestBody = await parseBody(req)
  const mock = MOCKS.find(
    (m) =>
      m.method === req.method &&
      isPathEqual(pathname, m.path) &&
      (!m.count || m.hits < m.count) &&
      isPartialMatch(m.requestBody, requestBody)
  )

  const reqId = randomUUID()
  const status = mock ? mock.response.status : 404 // Determine status

  const reqEntry: RequestDetails = {
    id: reqId,
    method: req.method || "UNKNOWN",
    path: pathname,
    timestamp: new Date().toLocaleString(),
    headers: { ...req.headers },
    body: requestBody,
    status: status,
    mock: mock ? mock.id : undefined
  }
  REQUEST_LOG.push(reqEntry)

  if (!mock) return false

  mock.hits++
  mock.requests.push(reqId)

  sendJSON(res, status, mock.response.body, mock.response.headers)
  return true
}
const requestHandler = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { pathname } = url.parse(req.url || "/", true)
    const path = pathname || "/"
    if (await handleControlRoutes(req, res, path)) return
    if (await handleMockRoutes(req, res, path)) return
    sendJSON(res, 404, { error: "Not Found", path })
  } catch (err) {
    sendJSON(res, 500, { error: "Internal Server Error" })
  }
}

const startServer = () => {
  http.createServer(requestHandler).listen(CONFIG.HTTP_PORT, () => {
    console.log(`> HTTP Running:  http://localhost:${CONFIG.HTTP_PORT}/mocks`)
  })

  if (CONFIG.HTTPS_ENABLED) {
    try {
      const options = { key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem") }
      https.createServer(options, requestHandler).listen(CONFIG.HTTPS_PORT)
    } catch (e) {
      console.log("> HTTPS skip (no certs)")
    }
  }
}

startServer()
