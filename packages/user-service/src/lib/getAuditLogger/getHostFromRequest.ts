import type { IncomingMessage } from "http"

export function getHostFromRequest(req: IncomingMessage): string {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Forwarded
  // Forwarded: by=<identifier>;for=<identifier>;host=<host>;proto=<http|https>

  if (req.headers.forwarded) {
    const forwardHeader: Record<string, string> = Object.fromEntries(
      req.headers.forwarded
        .split(";")
        .filter((elem) => !!elem)
        .map((kv) => kv.split("="))
        .map((arr) => [arr[0].trim().toLowerCase(), arr[1].trim()])
    )

    const host = forwardHeader["host"]
    if (host) {
      return host
    }
  }

  const forwardedHostKey = Object.keys(req.headers).find((h) => h.toLowerCase() == "x-forwarded-host")
  if (forwardedHostKey) {
    const forwardedHost = req.headers[forwardedHostKey]
    if (typeof forwardedHost === "string") {
      return forwardedHost
    } else if (Array.isArray(forwardedHost)) {
      return forwardedHost[0]
    }
  }

  // request header "host" can also contain a port (which we are not interested in)
  return req.headers.host?.split(":")[0] ?? ""
}
