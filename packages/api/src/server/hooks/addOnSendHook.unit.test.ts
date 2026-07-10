import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import addOnSendHook from "./addOnSendHook"

describe("addOnSendHook (Unit Test)", () => {
  let mockFastify: Partial<FastifyInstance>

  beforeEach(() => {
    mockFastify = {
      addHook: jest.fn()
    }
  })

  it("should register the onSend hook correctly", () => {
    addOnSendHook(mockFastify as FastifyInstance)

    expect(mockFastify.addHook).toHaveBeenCalledTimes(1)
    expect(mockFastify.addHook).toHaveBeenCalledWith("onSend", expect.any(Function))
  })

  it("should append the x-trace-id header and return the payload unmodified", async () => {
    addOnSendHook(mockFastify as FastifyInstance)

    const addHookMock = mockFastify.addHook as jest.Mock
    const onSendCallback = addHookMock.mock.calls[0][1]

    const mockRequest = {
      traceId: "mock-trace-999"
    } as FastifyRequest

    const mockReply = {
      header: jest.fn()
    } as unknown as FastifyReply

    const mockPayload = '{"message":"hello world"}'

    const result = await onSendCallback(mockRequest, mockReply, mockPayload)

    expect(mockReply.header).toHaveBeenCalledTimes(1)
    expect(mockReply.header).toHaveBeenCalledWith("x-trace-id", "mock-trace-999")

    expect(result).toBe(mockPayload)
  })
})
