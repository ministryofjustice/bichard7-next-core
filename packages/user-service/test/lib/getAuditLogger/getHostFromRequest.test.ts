import { getHostFromRequest } from "lib/getAuditLogger/getHostFromRequest"
import type { IncomingMessage } from "http"

it("should return the request host if one is specified", () => {
  const request = { headers: { host: "example.com" } } as unknown as IncomingMessage

  const host = getHostFromRequest(request)

  expect(host).toBe("example.com")
})

it("should return the request origin if one is specified", () => {
  const request = { headers: { origin: "example.com" } } as unknown as IncomingMessage

  const host = getHostFromRequest(request)

  expect(host).toBe("example.com")
})

it("should return host if x-origin is invalid", () => {
  const request = { headers: { "x-origin": "invalid", host: "example.com" } } as unknown as IncomingMessage

  const host = getHostFromRequest(request)

  expect(host).toBe("example.com")
})

it.each(["http://example.com", "https://example.com"])("should parse host from x-origin '%s'", (originUrl) => {
  const request = {
    headers: { host: "localhost", "x-origin": originUrl }
  } as unknown as IncomingMessage

  const host = getHostFromRequest(request)

  expect(host).toBe("example.com")
})
