import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { OK } from "http-status"
import { Readable } from "node:stream"

import type DatabaseGateway from "../../../types/DatabaseGateway"

import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import { createReportHandler } from "./createReportHandler"
import { reportStream } from "./reportStream"

jest.mock("@moj-bichard7/common/utils/userPermissions")
jest.mock("./reportStream")

describe("createReportHandler", () => {
  let mockReply: FastifyReply
  let mockDatabase: DatabaseGateway
  let mockUser: User
  let mockQuery: any
  let mockStrategy: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      type: jest.fn().mockReturnThis()
    } as unknown as FastifyReply

    mockDatabase = {
      readonly: { name: "readonly-connection" }
    } as unknown as DatabaseGateway

    mockUser = { username: "test-user" } as User
    mockQuery = { fromDate: "2023-01-01" }
    mockStrategy = jest.fn()
  })

  it("should return NotAllowedError if the user lacks ViewReports permission", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({
      [Permission.ViewReports]: false
    })

    const handler = createReportHandler(mockStrategy)
    const result = await handler(mockDatabase, mockUser, mockQuery, mockReply)

    expect(result).toBeInstanceOf(NotAllowedError)
    expect(mockReply.send).not.toHaveBeenCalled()
    expect(mockStrategy).not.toHaveBeenCalled()
  })

  it("should setup stream, headers, and call the strategy if user has permission", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({
      [Permission.ViewReports]: true
    })
    ;(reportStream as jest.Mock).mockImplementation(async (_stream, callback) => {
      const mockProcessBatch = jest.fn()
      await callback(mockProcessBatch)
    })

    const handler = createReportHandler(mockStrategy)

    handler(mockDatabase, mockUser, mockQuery, mockReply)

    expect(mockReply.code).toHaveBeenCalledWith(OK)
    expect(mockReply.type).toHaveBeenCalledWith("application/json")
    expect(mockReply.send).toHaveBeenCalledWith(expect.any(Readable))

    expect(mockStrategy).toHaveBeenCalledWith(mockDatabase.readonly, mockUser, mockQuery, expect.any(Function))
  })

  it("should destroy the stream if an error occurs during report generation", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({
      [Permission.ViewReports]: true
    })

    const expectedError = new Error("Database timeout")

    ;(reportStream as jest.Mock).mockImplementation(async (stream: Readable) => {
      stream.destroy(expectedError)
      throw expectedError
    })

    const destroySpy = jest.spyOn(Readable.prototype, "destroy")
    const handler = createReportHandler(mockStrategy)

    await handler(mockDatabase, mockUser, mockQuery, mockReply)

    const stream = (mockReply.send as jest.Mock).mock.calls[0][0] as Readable
    stream.on("error", () => {})

    await new Promise(process.nextTick)

    expect(destroySpy).toHaveBeenCalledWith(expectedError)

    destroySpy.mockRestore()
  })
})
