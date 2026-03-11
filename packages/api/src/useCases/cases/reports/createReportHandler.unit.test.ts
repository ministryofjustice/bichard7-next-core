import type { User } from "@moj-bichard7/common/types/User"
import type { Readable } from "node:stream"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { EventEmitter } from "node:events"

import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import { createReportHandler } from "./createReportHandler"

jest.mock("@moj-bichard7/common/utils/userPermissions")

const consumeStream = async (stream: Readable): Promise<string> => {
  let result = ""
  for await (const chunk of stream) {
    result += chunk
  }

  return result
}

describe("createReportHandler", () => {
  let mockReply: any
  let mockDatabase: any
  let mockUser: User
  let mockQuery: any
  let mockRawResponse: EventEmitter

  beforeEach(() => {
    jest.clearAllMocks()

    mockRawResponse = new EventEmitter()

    mockReply = {
      code: jest.fn().mockReturnThis(),
      raw: mockRawResponse,
      send: jest.fn().mockImplementation(() => {
        process.nextTick(() => mockRawResponse.emit("finish"))
      }),
      type: jest.fn().mockReturnThis()
    }

    const mockTransaction = jest.fn().mockImplementation(async (cb) => {
      return await cb(mockDatabase)
    })

    mockDatabase = {
      writable: {
        transaction: mockTransaction
      }
    }

    mockUser = { username: "test_user" } as User
    mockQuery = { dateFrom: "2024-01-01" }
  })

  it("should return NotAllowedError if the user lacks ViewReports permission", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: false })
    const mockStrategy = jest.fn()
    const handler = createReportHandler(mockStrategy)

    const result = await handler(mockDatabase, mockUser, mockQuery, mockReply)

    expect(result).toBeInstanceOf(NotAllowedError)
    expect(mockReply.send).not.toHaveBeenCalled()
  })

  it("should execute inside a transaction and wait for the finish event", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: true })
    const mockStrategy = async function* () {
      yield [{ id: 1 }]
    }

    const handler = createReportHandler(mockStrategy as any)

    await handler(mockDatabase, mockUser, mockQuery, mockReply)

    expect(mockDatabase.writable.transaction).toHaveBeenCalled()
    expect(mockReply.send).toHaveBeenCalled()
  })

  it("should stream an empty array and report 0 count if strategy yields no data", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: true })
    const mockStrategy = async function* () {}

    const onStreamCompleteMock = jest.fn()
    const handler = createReportHandler(mockStrategy as any, onStreamCompleteMock)

    await handler(mockDatabase, mockUser, mockQuery, mockReply)

    const stream = mockReply.send.mock.calls[0][0] as Readable
    const output = await consumeStream(stream)

    expect(output).toBe("[]")
    expect(onStreamCompleteMock).toHaveBeenCalledWith(0)
  })

  it("should correctly format and stream chunks as a valid JSON array", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: true })
    const mockStrategy = async function* () {
      yield [{ id: 1, name: "Alice" }]
      yield [{ id: 2, name: "Bob" }]
    }

    const handler = createReportHandler(mockStrategy as any)

    await handler(mockDatabase, mockUser, mockQuery, mockReply)

    const stream = mockReply.send.mock.calls[0][0] as Readable
    const output = await consumeStream(stream)

    expect(output).toBe('[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]')
  })

  it("should use a custom extractCount if provided", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: true })
    const mockStrategy = async function* () {
      yield [{ cases: [1, 2] }]
    }

    const onStreamCompleteMock = jest.fn()
    const extractCount = (chunk: any[]) => chunk[0].cases.length

    const handler = createReportHandler(mockStrategy as any, onStreamCompleteMock, extractCount)

    await handler(mockDatabase, mockUser, mockQuery, mockReply)

    const stream = mockReply.send.mock.calls[0][0] as Readable
    await consumeStream(stream)

    expect(onStreamCompleteMock).toHaveBeenCalledWith(2)
  })
})
