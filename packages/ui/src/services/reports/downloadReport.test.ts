import { downloadReport } from "./downloadReport"
import { isRecordArray } from "services/reports/utils/isRecordArray"
import type { ReportType } from "types/reports/ReportType"

jest.mock("services/reports/utils/isRecordArray")
const mockedIsRecordArray = isRecordArray as jest.MockedFunction<typeof isRecordArray>

const createMockStream = (chunks: string[]) => {
  const encoder = new TextEncoder()
  let currentIndex = 0

  return {
    getReader: () => ({
      read: jest.fn().mockImplementation(async () => {
        if (currentIndex < chunks.length) {
          const value = encoder.encode(chunks[currentIndex])
          currentIndex++
          return { done: false, value }
        }

        return { done: true, value: undefined }
      })
    })
  } as unknown as ReadableStream<Uint8Array>
}

describe("downloadReport", () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.clearAllMocks()

    global.fetch = jest.fn()
  })

  afterAll(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  it("should successfully download, parse, and return report data", async () => {
    const mockData = [{ id: 1, name: "Test Report Data" }]
    const mockJsonString = JSON.stringify(mockData)

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: createMockStream([mockJsonString])
    })

    mockedIsRecordArray.mockReturnValue(true)

    const query = new URLSearchParams("status=active")
    const reportType = "TEST_REPORT" as ReportType

    const result = await downloadReport(reportType, query)

    expect(global.fetch).toHaveBeenCalledWith("/bichard/api/reports?status=active&reportType=TEST_REPORT")

    expect(mockedIsRecordArray).toHaveBeenCalledWith(mockData)

    expect(result).toEqual(mockData)
  })

  it("should throw an error if the response is not OK", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    const query = new URLSearchParams()

    await expect(downloadReport("TEST" as ReportType, query)).rejects.toThrow("Server responded with status: 404")
  })

  it("should throw an error if there is no response body", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: null
    })

    const query = new URLSearchParams()

    await expect(downloadReport("TEST" as ReportType, query)).rejects.toThrow("No response body")
  })

  it("should throw an error if isRecordArray validation fails", async () => {
    const mockData = { invalidFormat: "Not an array of records" }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: createMockStream([JSON.stringify(mockData)])
    })

    mockedIsRecordArray.mockReturnValue(false)

    const query = new URLSearchParams()

    await expect(downloadReport("TEST" as ReportType, query)).rejects.toThrow(
      "Invalid report data format received from API"
    )
  })
})
