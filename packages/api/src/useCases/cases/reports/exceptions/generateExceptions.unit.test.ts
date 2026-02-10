import type { ExceptionReportQuery } from "@moj-bichard7/common/types/ExceptionReport"
import type { FastifyReply } from "fastify"

import { type User } from "@moj-bichard7/common/types/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { OK } from "http-status"
import { Readable } from "node:stream"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { exceptionsReport } from "../../../../services/db/cases/reports/exceptions"
import { NotAllowedError } from "../../../../types/errors/NotAllowedError"
import { reportStream } from "../reportStream"
import { generateExceptions } from "./generateExceptions"

jest.mock("../../../../services/db/cases/reports/exceptions", () => ({
  exceptionsReport: jest.fn()
}))
jest.mock("../reportStream", () => ({
  reportStream: jest.fn(() => Promise.resolve())
}))

describe("generateExceptions with UserGroups", () => {
  let mockDatabase: jest.Mocked<Partial<DatabaseGateway>>
  let mockReply: jest.Mocked<Partial<FastifyReply>>
  let mockQuery: ExceptionReportQuery

  beforeEach(() => {
    jest.clearAllMocks()

    mockDatabase = { readonly: "mock-readonly-db" } as unknown as DatabaseGateway
    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      type: jest.fn().mockReturnThis()
    }

    mockQuery = {
      exceptions: true,
      fromDate: new Date("2023-01-01"),
      toDate: new Date("2023-01-02"),
      triggers: true
    }
  })

  describe("Permission & Group Logic", () => {
    it("should allow access when user is in the Supervisor group", () => {
      const supervisorUser = { groups: [UserGroup.Supervisor] } as User

      const result = generateExceptions(
        mockDatabase as DatabaseGateway,
        supervisorUser,
        mockQuery,
        mockReply as FastifyReply
      )

      expect(result).toBeUndefined()
      expect(mockReply.code).toHaveBeenCalledWith(OK)
    })

    it("should return NotAllowedError when user is only an ExceptionHandler", () => {
      const handlerUser = { groups: [UserGroup.ExceptionHandler] } as User

      const result = generateExceptions(
        mockDatabase as DatabaseGateway,
        handlerUser,
        mockQuery,
        mockReply as FastifyReply
      )

      expect(result).toBeInstanceOf(NotAllowedError)
      expect(mockReply.send).not.toHaveBeenCalled()
    })

    it("should return NotAllowedError when user has no groups", () => {
      const emptyUser = { groups: [] } as unknown as User

      const result = generateExceptions(
        mockDatabase as DatabaseGateway,
        emptyUser,
        mockQuery,
        mockReply as FastifyReply
      )

      expect(result).toBeInstanceOf(NotAllowedError)
    })
  })

  describe("Stream Handling", () => {
    const validSupervisor = { groups: [UserGroup.Supervisor] } as User

    it("should initialise the JSON stream and send it to Fastify", () => {
      generateExceptions(mockDatabase as DatabaseGateway, validSupervisor, mockQuery, mockReply as FastifyReply)

      const [sentStream] = (mockReply.send as jest.Mock).mock.lastCall

      expect(mockReply.code).toHaveBeenCalledWith(OK)
      expect(mockReply.type).toHaveBeenCalledWith("application/json")
      expect(sentStream).toBeInstanceOf(Readable)
    })

    it("should call the database report service within the stream callback", async () => {
      let capturedCallback: (processBatch: any) => Promise<void>
      ;(reportStream as jest.Mock).mockImplementation((_stream, callback) => {
        capturedCallback = callback
        return Promise.resolve()
      })

      generateExceptions(mockDatabase as DatabaseGateway, validSupervisor, mockQuery, mockReply as FastifyReply)

      const mockProcessBatch = jest.fn()
      await capturedCallback!(mockProcessBatch)

      expect(exceptionsReport).toHaveBeenCalledWith(mockDatabase.readonly, validSupervisor, mockQuery, mockProcessBatch)
    })

    it("should destroy the stream with the specific error if generation fails", async () => {
      const dbError = new Error("Database Timeout")
      ;(reportStream as jest.Mock).mockRejectedValue(dbError)

      generateExceptions(mockDatabase as DatabaseGateway, validSupervisor, mockQuery, mockReply as FastifyReply)

      const [sentStream] = (mockReply.send as jest.Mock).mock.lastCall

      sentStream.on("error", () => {})
      const destroySpy = jest.spyOn(sentStream, "destroy")

      await new Promise(process.nextTick)

      expect(destroySpy).toHaveBeenCalledWith(dbError)
    })
  })
})
