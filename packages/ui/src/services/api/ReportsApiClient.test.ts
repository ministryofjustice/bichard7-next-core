import { fetch, Agent } from "undici"
import ReportsApiClient from "./ReportsApiClient"

// Mock dependencies
jest.mock("undici", () => ({
  fetch: jest.fn(),
  Agent: jest.fn().mockImplementation(() => ({}))
}))

jest.mock("config", () => ({
  API_LOCATION: "https://mock-api.com"
}))

describe("ReportsApiClient", () => {
  const mockJwt = "mock-jwt-token"
  const mockedFetch = fetch as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Constructor", () => {
    it("should initialize undici Agent with rejectUnauthorized: false", () => {
      new ReportsApiClient(mockJwt)

      expect(Agent).toHaveBeenCalledWith({
        connect: {
          rejectUnauthorized: false
        }
      })
    })
  })

  describe("fetchReport", () => {
    let client: ReportsApiClient

    beforeEach(() => {
      client = new ReportsApiClient(mockJwt)
    })

    it("should yield chunks from a successful stream response", async () => {
      const mockStream = (async function* () {
        yield Buffer.from("chunk 1")
        yield Buffer.from("chunk 2")
      })()

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        body: mockStream
      })

      const url = "/reports/123"
      const chunks: Buffer[] = []

      for await (const chunk of client.fetchReport<Buffer>(url)) {
        if (chunk instanceof Error) {
          throw chunk
        }

        chunks.push(chunk)
      }

      expect(mockedFetch).toHaveBeenCalledWith(
        `https://mock-api.com${url}`,
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: `Bearer ${mockJwt}`
          },
          dispatcher: expect.any(Object)
        })
      )

      expect(chunks).toHaveLength(2)
      expect(chunks[0].toString()).toBe("chunk 1")
      expect(chunks[1].toString()).toBe("chunk 2")
    })

    it("should yield a formatted Error when an HTTP error occurs", async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const iterable = client.fetchReport("/reports/123")
      const iterator = iterable[Symbol.asyncIterator]()
      const result = await iterator.next()

      expect(result.value).toBeInstanceOf(Error)
      expect((result.value as Error).message).toBe("Stream failed: Request failed with status code 500")
    })

    it("should yield the raw error when a generic (network) Error occurs", async () => {
      const genericError = new Error("A standard node or parsing error")

      mockedFetch.mockRejectedValueOnce(genericError)

      const iterable = client.fetchReport("/reports/123")
      const iterator = iterable[Symbol.asyncIterator]()
      const result = await iterator.next()

      expect(result.value).toBeInstanceOf(Error)
      expect((result.value as Error).message).toBe("A standard node or parsing error")
      expect(result.value).toBe(genericError)
    })
  })
})
