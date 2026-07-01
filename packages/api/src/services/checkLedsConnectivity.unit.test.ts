import checkLedsConnectivity from "./checkLedsConnectivity"

describe("checkLedsConnectivity", () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    process.env.LEDS_API_URL = "https://api.leds.test/health"
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
    consoleSpy.mockRestore()
  })

  it("returns true when LEDS API returns a successful 401 response", async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({
      status: 401
    })

    const result = await checkLedsConnectivity(undefined, mockFetch)

    expect(result).toBe(true)
  })

  it("returns false when LEDS API returns an error", async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({
      status: 500
    })

    const result = await checkLedsConnectivity(undefined, mockFetch)

    expect(result).toBe(false)
  })

  it("returns false when LEDS API times out", async () => {
    process.env.LEDS_API_URL = "http://localhost/mock-leds"

    const timeoutError = new DOMException("The operation was aborted due to timeout.", "TimeoutError")
    const mockFetch = jest.fn().mockRejectedValue(timeoutError)

    const result = await checkLedsConnectivity(undefined, mockFetch)

    expect(result).toBe(false)
  })

  it("returns false when the network request throws an error", async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce(new Error("Network error"))

    const result = await checkLedsConnectivity(undefined, mockFetch)

    expect(result).toBe(false)
  })

  it("returns false when env variable is not found", async () => {
    delete process.env.LEDS_API_URL

    const result = await checkLedsConnectivity()

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith("LEDS_API_URL environment variable not found")
  })
})
