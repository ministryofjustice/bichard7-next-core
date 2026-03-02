import https from "node:https"
import axios from "axios"
import ReportsApiClient from "./ReportsApiClient" // adjust the import path as needed
import { Readable } from "node:stream"

// Mock dependencies
jest.mock("axios")
jest.mock("node:https")
jest.mock("config", () => ({
  API_LOCATION: "https://mock-api.com"
}))

describe("ReportsApiClient", () => {
  const mockJwt = "mock-jwt-token"
  let mockGet: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockGet = jest.fn()
    ;(axios.create as jest.Mock).mockReturnValue({
      get: mockGet
    })
  })

  describe("Constructor", () => {
    it("should initialize axios client with correct config and https agent", () => {
      new ReportsApiClient(mockJwt)

      expect(https.Agent).toHaveBeenCalledWith({
        rejectUnauthorized: false
      })

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: "https://mock-api.com",
          headers: {
            Authorization: `Bearer ${mockJwt}`
          },
          httpsAgent: expect.any(Object)
        })
      )
    })
  })

  describe("fetchReport", () => {
    let client: ReportsApiClient

    beforeEach(() => {
      client = new ReportsApiClient(mockJwt)
    })

    it("should yield chunks from a successful stream response", async () => {
      const mockStream = Readable.from([Buffer.from("chunk 1"), Buffer.from("chunk 2")])

      mockGet.mockResolvedValueOnce({ data: mockStream })

      const url = "/reports/123"
      const chunks: Buffer[] = []

      for await (const chunk of client.fetchReport(url)) {
        chunks.push(chunk as Buffer)
      }

      expect(mockGet).toHaveBeenCalledWith(url, { responseType: "stream" })
      expect(chunks).toHaveLength(2)
      expect(chunks[0].toString()).toBe("chunk 1")
      expect(chunks[1].toString()).toBe("chunk 2")
    })

    it("should merge custom AxiosRequestConfig correctly", async () => {
      const mockStream = Readable.from([Buffer.from("data")])
      mockGet.mockResolvedValueOnce({ data: mockStream })

      const iterable = client.fetchReport("/reports/123", { timeout: 5000 })
      const iterator = iterable[Symbol.asyncIterator]()
      await iterator.next()

      expect(mockGet).toHaveBeenCalledWith("/reports/123", {
        timeout: 5000,
        responseType: "stream"
      })
    })

    it("should yield a formatted Error when an AxiosError occurs", async () => {
      const mockAxiosError = new Error("Request failed with status code 500")

      ;(axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true)
      mockGet.mockRejectedValueOnce(mockAxiosError)

      const iterable = client.fetchReport("/reports/123")
      const iterator = iterable[Symbol.asyncIterator]()
      const result = await iterator.next()

      expect(result.value).toBeInstanceOf(Error)
      expect((result.value as Error).message).toBe("Stream failed: Request failed with status code 500")
    })

    it("should yield the raw error when a generic (non-Axios) Error occurs", async () => {
      const genericError = new Error("A standard node or parsing error")

      ;(axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(false)
      mockGet.mockRejectedValueOnce(genericError)

      const iterable = client.fetchReport("/reports/123")
      const iterator = iterable[Symbol.asyncIterator]()
      const result = await iterator.next()

      expect(result.value).toBeInstanceOf(Error)
      expect((result.value as Error).message).toBe("A standard node or parsing error")
      expect(result.value).toBe(genericError)
    })
  })
})
