import checkLedsConnectivity from "./checkLedsConnectivity"

describe("checkLedsConnectivity", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv, LEDS_API_URL: "https://api.leds.test/health" }
    global.fetch = jest.fn()
  })

  afterEach(() => {
    process.env = originalEnv
    jest.clearAllMocks()
  })

  it("returns true when LEDS API returns a successful 200 response", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200
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
})
