import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"
import type { Readable } from "node:stream"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { OK } from "http-status"

import type DatabaseGateway from "../../../types/DatabaseGateway"

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
  let mockReply: FastifyReply
  let mockDatabase: DatabaseGateway
  let mockUser: User
  let mockQuery: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
      type: jest.fn().mockReturnThis()
    } as unknown as FastifyReply

    mockDatabase = { readonly: {} } as DatabaseGateway
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
    expect(mockStrategy).not.toHaveBeenCalled()
  })

  it("should stream an empty array if the strategy yields no data", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: true })

    const mockStrategy = async function* () {}

    const handler = createReportHandler(mockStrategy)

    await handler(mockDatabase, mockUser, mockQuery, mockReply)

    expect(mockReply.code).toHaveBeenCalledWith(OK)
    expect(mockReply.type).toHaveBeenCalledWith("application/json")
    expect(mockReply.send).toHaveBeenCalled()

    const stream = (mockReply.send as jest.Mock).mock.calls[0][0] as Readable
    const output = await consumeStream(stream)

    expect(output).toBe("[]")
  })

  it("should correctly format and stream chunks of data as a valid JSON array", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: true })

    const mockStrategy = async function* () {
      yield [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
      ]
      yield [{ id: 3, name: "Charlie" }]
    }

    const handler = createReportHandler(mockStrategy)

    await handler(mockDatabase, mockUser, mockQuery, mockReply)

    expect(mockReply.code).toHaveBeenCalledWith(OK)
    expect(mockReply.type).toHaveBeenCalledWith("application/json")

    const stream = (mockReply.send as jest.Mock).mock.calls[0][0] as Readable
    const output = await consumeStream(stream)

    expect(output).toBe('[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"},{"id":3,"name":"Charlie"}]')

    expect(JSON.parse(output)).toHaveLength(3)
  })

  it("should pass the correct arguments to the report strategy", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: true })
    const mockStrategy = jest.fn().mockImplementation(async function* () {})
    const handler = createReportHandler(mockStrategy)

    await handler(mockDatabase, mockUser, mockQuery, mockReply)

    const stream = (mockReply.send as jest.Mock).mock.calls[0][0] as Readable
    await consumeStream(stream)

    expect(mockStrategy).toHaveBeenCalledWith(mockDatabase.readonly, mockUser, mockQuery)
  })
})
