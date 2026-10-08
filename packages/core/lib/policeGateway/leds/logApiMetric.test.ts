import { ledsOperations } from "../../../types/LedsOperation"
import logApiMetric from "./logApiMetric"

describe("logApiMetric", () => {
  let consoleLogSpy: jest.SpyInstance

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  it("logs the correct JSON string with all parameters provided", () => {
    const requestUrl = "/api/v1/leds"
    const operation = ledsOperations.AsnQuery
    const durationMs = 120
    const correlationId = "abc123xyz"
    const status = 200

    logApiMetric(requestUrl, durationMs, correlationId, operation, status)

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)

    const parsedLog = JSON.parse(consoleLogSpy.mock.calls[0][0])

    expect(parsedLog).toEqual({
      event: "LEDS Gateway API Call",
      requestUrl,
      operation,
      durationMs,
      correlationId,
      status
    })
  })

  it("Handles undefined axios status", () => {
    const requestUrl = "/api/v1/leds"
    const operation = ledsOperations.AsnQuery
    const durationMs = 60
    const correlationId = "def456xyz"
    const status = undefined

    logApiMetric(requestUrl, durationMs, correlationId, operation, status)

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)

    const parsedLog = JSON.parse(consoleLogSpy.mock.calls[0][0])

    expect(parsedLog).toEqual({
      event: "LEDS Gateway API Call",
      requestUrl,
      operation,
      durationMs,
      correlationId,
      status: undefined
    })
  })
})
