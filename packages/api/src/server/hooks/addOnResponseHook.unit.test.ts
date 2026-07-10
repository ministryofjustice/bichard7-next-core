import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import addOnResponseHook from "./addOnResponseHook" // Adjust import path

describe("addOnResponseHook (Unit Test)", () => {
  let mockFastify: Partial<FastifyInstance>

  beforeEach(() => {
    mockFastify = {
      addHook: jest.fn()
    }
  })

  it("should register the onResponse hook correctly", () => {
    addOnResponseHook(mockFastify as FastifyInstance)

    expect(mockFastify.addHook).toHaveBeenCalledTimes(1)
    expect(mockFastify.addHook).toHaveBeenCalledWith("onResponse", expect.any(Function))
  })

  it("should log the correct request details when the response completes", () => {
    addOnResponseHook(mockFastify as FastifyInstance)

    const addHookMock = mockFastify.addHook as jest.Mock
    const onResponseCallback = addHookMock.mock.calls[0][1]

    const mockRequest = {
      log: {
        info: jest.fn()
      },
      traceId: "mock-trace-456"
    } as unknown as FastifyRequest

    const mockReply = {
      elapsedTime: 120.5,
      statusCode: 200
    } as unknown as FastifyReply

    onResponseCallback(mockRequest, mockReply)

    expect(mockRequest.log.info).toHaveBeenCalledTimes(1)

    expect(mockRequest.log.info).toHaveBeenCalledWith(
      {
        responseTime: 120.5,
        statusCode: 200
      },
      "request completed"
    )
  })
})
