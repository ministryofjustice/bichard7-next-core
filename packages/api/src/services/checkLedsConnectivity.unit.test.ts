import checkLedsConnectivity from "./checkLedsConnectivity"

describe("checkLedsConnectivity", () => {
  beforeAll(() => {
    process.env.LEDS_API_URL = "https://api.leds.test/health"
  })

  beforeEach(() => {
    jest.resetModules()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("returns true when LEDS API returns a successful 401 response", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 401
    })

    const result = await checkLedsConnectivity()

    expect(result).toBe(true)
    expect(global.fetch).toHaveBeenCalledWith("https://api.leds.test/health", { method: "GET" })
  })

  it("returns false when LEDS API returns an error", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    const result = await checkLedsConnectivity()

    expect(result).toBe(false)
  })

  it("returns false when LEDS API times out", async () => {
    jest.useFakeTimers()
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}))

    const promiseResult = checkLedsConnectivity()
    jest.advanceTimersByTime(2100)

    const result = await promiseResult
    expect(result).toBe(false)
  })

  it("returns false when the network request throws an error", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"))

    const result = await checkLedsConnectivity()

    expect(result).toBe(false)
  })

  it("returns false when env variable is not found", async () => {
    delete process.env.LEDS_API_URL

    const result = await checkLedsConnectivity()

    expect(result).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
