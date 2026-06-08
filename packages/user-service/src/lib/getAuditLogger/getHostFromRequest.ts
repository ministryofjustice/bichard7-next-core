import type { IncomingMessage } from "http"

function extractHost(host: string) {
  // Host string can also contain port (which we're not interested in)
  return host.split(":")[0]
}

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
      return extractHost(host)
    }
  }

  const headerKey = Object.keys(req.headers).find((h) => h.toLowerCase() == "x-forwarded-host")

  if (headerKey) {
    const headerValue = req.headers[headerKey]
    if (typeof headerValue === "string") {
      return extractHost(headerValue)
    } else if (Array.isArray(headerValue)) {
      return extractHost(headerValue[0])
    }
  }

  return extractHost(req.headers.host ?? "")
}
