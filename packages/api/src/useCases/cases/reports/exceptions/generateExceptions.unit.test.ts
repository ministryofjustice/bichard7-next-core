import type { ExceptionReportQuery } from "@moj-bichard7/common/contracts/ExceptionReport"
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
  let mockDatabase: DatabaseGateway
  let mockReply: FastifyReply
  let mockQuery: ExceptionReportQuery

  beforeEach(() => {
    jest.clearAllMocks()

    mockDatabase = { readonly: "mock-readonly-db" } as unknown as DatabaseGateway
    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      type: jest.fn().mockReturnThis()
    } as unknown as FastifyReply

    mockQuery = {
      exceptions: true,
      fromDate: new Date("2023-01-01"),
      toDate: new Date("2023-01-02"),
      triggers: true
    }
    ;(reportStream as jest.Mock).mockResolvedValue(undefined)
  })

  describe("Permission & Group Logic", () => {
    it("should allow access when user is in the Supervisor group", async () => {
      const supervisorUser = { groups: [UserGroup.Supervisor] } as User

      const result = await generateExceptions(mockDatabase, supervisorUser, mockQuery, mockReply)

      expect(result).toBeUndefined()
      expect(mockReply.code).toHaveBeenCalledWith(OK)
    })

    it("should return NotAllowedError when user is only an ExceptionHandler", async () => {
      const handlerUser = { groups: [UserGroup.ExceptionHandler] } as User

      const result = await generateExceptions(mockDatabase, handlerUser, mockQuery, mockReply)

      expect(result).toBeInstanceOf(NotAllowedError)
      expect(mockReply.send).not.toHaveBeenCalled()
    })

    it("should return NotAllowedError when user has no groups", async () => {
      const emptyUser = { groups: [] } as unknown as User

      const result = await generateExceptions(mockDatabase, emptyUser, mockQuery, mockReply)

      expect(result).toBeInstanceOf(NotAllowedError)
    })
  })

  describe("Stream Handling", () => {
    const validSupervisor = { groups: [UserGroup.Supervisor] } as User

    it("should initialise the JSON stream and send it to Fastify", async () => {
      await generateExceptions(mockDatabase, validSupervisor, mockQuery, mockReply)

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

      await generateExceptions(mockDatabase, validSupervisor, mockQuery, mockReply)

      const mockProcessBatch = jest.fn()
      await capturedCallback!(mockProcessBatch)

      expect(exceptionsReport).toHaveBeenCalledWith(mockDatabase.readonly, validSupervisor, mockQuery, mockProcessBatch)
    })

    it("should return the specific error if generation fails", async () => {
      const dbError = new Error("Database Timeout")
      ;(reportStream as jest.Mock).mockRejectedValue(dbError)

      const result = await generateExceptions(mockDatabase, validSupervisor, mockQuery, mockReply)

      const [sentStream] = (mockReply.send as jest.Mock).mock.calls[0]

      sentStream.on("error", () => {})

      expect(result).toBe(dbError)
    })
  })
})
