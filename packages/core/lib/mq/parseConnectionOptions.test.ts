import parseConnectionOptions from "lib/mq/parseConnectionOptions"

describe("parseConnectionOptions()", () => {
  it("should parse a non-SSL host and port when the protocol is HTTP", () => {
    const options = parseConnectionOptions("http://localhost:51613")

    expect(options.host).toBe("localhost")
    expect(options.port).toBe(51613)
    expect(options.ssl).toBe(false)
  })

  it("should parse an SSL host and port when the protocol is ssl", () => {
    const options = parseConnectionOptions("ssl://localhost:51613")

    expect(options.host).toBe("localhost")
    expect(options.port).toBe(51613)
    expect(options.ssl).toBe(true)
  })

  it("should parse an SSL host and port when the protocol is stomp+ssl", () => {
    const options = parseConnectionOptions("stomp+ssl://localhost:51613")

    expect(options.host).toBe("localhost")
    expect(options.port).toBe(51613)
    expect(options.ssl).toBe(true)
  })
})
