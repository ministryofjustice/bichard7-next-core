interface ConnectionOptions {
  host: string
  port: number
  ssl: boolean
}

export default (url: string): ConnectionOptions => {
  const protocolPosition = url.indexOf("://")
  const protocol = url.substring(0, protocolPosition)

  const portPosition = url.lastIndexOf(":")
  const port = +url.substring(portPosition + 1)

  const host = url.substring(protocolPosition + 3, portPosition)

  return {
    host,
    port,
    ssl: /ssl/.test(protocol)
  }
}
