import type { IncomingMessage } from "http"

export function getHostFromRequest(req: IncomingMessage): string {
  // x-origin header is inserted by nginx auth proxy
  const xOrigin = req.headers["x-origin"]?.toString() ?? ""

  if (URL.canParse(xOrigin)) {
    const xOriginUrl = new URL(xOrigin)
    return xOriginUrl.host
  }

  return req.headers.origin ?? req.headers.host ?? ""
}
