import parseConnectionOptions from "./parseConnectionOptions"

describe("parseConnectionOptions()", () => {
  it("Should parse a non-SSL host and port when the protocol is HTTP", () => {
    const options = parseConnectionOptions("http://localhost:61613")

    expect(options.host).toBe("localhost")
    expect(options.port).toBe(61613)
    expect(options.ssl).toBe(false)
  })

  it("Should parse an SSL host and port when the protocol is ssl", () => {
    const options = parseConnectionOptions("ssl://localhost:61613")

    expect(options.host).toBe("localhost")
    expect(options.port).toBe(61613)
    expect(options.ssl).toBe(true)
  })

  it("Should parse an SSL host and port when the protocol is stomp+ssl", () => {
    const options = parseConnectionOptions("stomp+ssl://localhost:61613")

    expect(options.host).toBe("localhost")
    expect(options.port).toBe(61613)
    expect(options.ssl).toBe(true)
  })
})
