import { getHostFromRequest } from "lib/getAuditLogger/getHostFromRequest"
import type { IncomingMessage } from "http"

it("should return an empty string if no host or forwarded header is provided", () => {
  const request = { headers: {} } as unknown as IncomingMessage

  const host = getHostFromRequest(request)

  expect(host).toBe("")
})

it("should return the request host if one is specified", () => {
  const request = { headers: { host: "example.com" } } as unknown as IncomingMessage

  const host = getHostFromRequest(request)

  expect(host).toBe("example.com")
})

it("should strip any port from the host header", () => {
  const request = { headers: { host: "example.com:8080" } } as unknown as IncomingMessage

  const host = getHostFromRequest(request)

  expect(host).toBe("example.com")
})

it.each([
  "by=nginx; proto=http; for=127.0.0.1; host=bichard.example.gov.uk",
  "Host=bichard.example.gov.uk;By=nginx;Proto=http;For=127.0.0.1;"
])("should return the forwarded host from %s", (forwardedHeader) => {
  const request = {
    headers: { host: "localhost", forwarded: forwardedHeader }
  } as unknown as IncomingMessage

  const host = getHostFromRequest(request)

  expect(host).toBe("bichard.example.gov.uk")
})

it("should use the host header if the forwarded header does not contain host", () => {
  const request = {
    headers: { host: "localhost", forwarded: "for=192.168.0.1" }
  } as unknown as IncomingMessage

  const host = getHostFromRequest(request)

  expect(host).toBe("localhost")
})

it.each(["x-forwarded-host", "X-Forwarded-Host"])("should use host from '%s' if set", (forwardedHostHeader) => {
  const request = {
    headers: { host: "localhost", [forwardedHostHeader]: "example.com:8080" }
  } as unknown as IncomingMessage

  const host = getHostFromRequest(request)

  expect(host).toBe("example.com")
})
