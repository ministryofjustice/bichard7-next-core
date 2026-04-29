import { isError } from "@moj-bichard7/common/types/Result"

import checkDbConnectivity from "./checkDbConnectivity"

describe("checkDbConnectivity", () => {
  const mockDatabase = {
    connection: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return true when the database returns a value", async () => {
    mockDatabase.connection.mockResolvedValueOnce([{ connected: 1 }])

    const result = await checkDbConnectivity(mockDatabase as any)

    expect(isError(result)).toBe(false)
    expect(result).toBe(true)
  })

  it("should return false when the database throws an error", async () => {
    mockDatabase.connection.mockRejectedValueOnce(new Error("Connection Refused"))

    const result = await checkDbConnectivity(mockDatabase as any)

    expect(result).toBe(false)
  })

  it("should return false when db times out", async () => {
    jest.useFakeTimers()
    mockDatabase.connection.mockResolvedValueOnce(new Promise(() => {}))

    const resultPromise = checkDbConnectivity(mockDatabase as any)
    jest.advanceTimersByTime(2100)

    const result = await resultPromise
    expect(result).toBe(false)

    jest.useRealTimers()
  })
})
