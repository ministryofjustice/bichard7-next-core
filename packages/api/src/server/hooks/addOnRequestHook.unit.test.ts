import type { FastifyInstance, FastifyRequest } from "fastify"

import { randomUUID } from "crypto"

import addOnRequestHook from "./addOnRequestHook"

jest.mock("crypto", () => ({
  randomUUID: jest.fn()
}))

describe("addOnRequestHook", () => {
  let mockFastify: Partial<FastifyInstance>
  let hookCallback: (request: FastifyRequest) => Promise<void>

  beforeEach(() => {
    mockFastify = {
      addHook: jest.fn().mockImplementation((event, callback) => {
        if (event === "onRequest") {
          hookCallback = callback
        }
      })
    }

    addOnRequestHook(mockFastify as FastifyInstance)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("registers the onRequest hook", () => {
    expect(mockFastify.addHook).toHaveBeenCalledWith("onRequest", expect.any(Function))
  })

  describe("Hook Execution", () => {
    let mockChildLogger: { info: jest.Mock }
    let mockChildFn: jest.Mock
    let mockRequest: Partial<FastifyRequest>

    beforeEach(() => {
      mockChildLogger = {
        info: jest.fn()
      }

      mockChildFn = jest.fn().mockReturnValue(mockChildLogger)

      mockRequest = {
        headers: {},
        log: {
          child: mockChildFn
        } as any,
        method: "GET",
        params: { id: "123" },
        query: { sort: "asc" },
        url: "/api/test?sort=asc"
      }
    })

    it("uses the x-trace-id header if it is provided", async () => {
      mockRequest.headers = { "x-trace-id": "custom-header-id" }

      await hookCallback(mockRequest as FastifyRequest)

      expect(mockRequest.traceId).toBe("custom-header-id")
      expect(randomUUID).not.toHaveBeenCalled()
    })

    it("generates a UUID if the x-trace-id header is missing", async () => {
      ;(randomUUID as jest.Mock).mockReturnValue("generated-uuid-456")

      await hookCallback(mockRequest as FastifyRequest)

      expect(mockRequest.traceId).toBe("generated-uuid-456")
      expect(randomUUID).toHaveBeenCalled()
    })

    it("creates a child logger and logs the incoming request data", async () => {
      mockRequest.headers = { "x-trace-id": "trace-123" }

      await hookCallback(mockRequest as FastifyRequest)

      expect(mockChildFn).toHaveBeenCalledWith({ traceId: "trace-123" })

      expect(mockRequest.log).toBe(mockChildLogger)

      expect(mockChildLogger.info).toHaveBeenCalledWith(
        {
          requestMethod: "GET",
          requestParams: { id: "123" },
          requestQuery: { sort: "asc" },
          url: "/api/test?sort=asc"
        },
        "incoming request"
      )
    })
  })
})
