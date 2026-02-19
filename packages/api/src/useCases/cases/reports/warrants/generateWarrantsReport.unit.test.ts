import type { FastifyReply } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { OK } from "http-status"
import { Readable } from "node:stream"

import { warrants } from "../../../../services/db/cases/reports/warrants"
import { NotAllowedError } from "../../../../types/errors/NotAllowedError"
import { reportStream } from "../reportStream"
import { generateWarrantsReport } from "./generateWarrantsReport"

jest.mock("@moj-bichard7/common/utils/userPermissions")
jest.mock("../../../../services/db/cases/reports/warrants")
jest.mock("../reportStream")

describe("generateWarrantsReport", () => {
  const mockDatabase = { readonly: {} } as any
  const mockUser = { username: "test-user" } as any
  const query = { dateFrom: "2023-01-01" } as any
  let mockReply: FastifyReply

  beforeEach(() => {
    jest.resetAllMocks()

    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockImplementation((payload) => {
        if (payload instanceof Readable) {
          payload.on("error", () => {})
        }

        return mockReply
      }),
      type: jest.fn().mockReturnThis()
    } as any
  })

  it("should return NotAllowedError if user does not have ViewReports permission", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: false })

    const result = await generateWarrantsReport(mockDatabase, mockUser, query, mockReply)

    expect(result).toBeInstanceOf(NotAllowedError)
    expect(mockReply.send).not.toHaveBeenCalled()
  })

  it("should initialize the stream and call reportStream on success", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: true })
    ;(reportStream as jest.Mock).mockResolvedValue(undefined)

    const result = await generateWarrantsReport(mockDatabase, mockUser, query, mockReply)

    expect(result).toBeUndefined()
    expect(mockReply.code).toHaveBeenCalledWith(OK)
    expect(mockReply.type).toHaveBeenCalledWith("application/json")
    expect(reportStream).toHaveBeenCalledWith(expect.any(Readable), expect.any(Function))
  })

  it("should return an error if reportStream throws", async () => {
    const testError = new Error("Stream failure")
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: true })
    ;(reportStream as jest.Mock).mockRejectedValue(testError)

    const result = await generateWarrantsReport(mockDatabase, mockUser, query, mockReply)

    expect(result).toBe(testError)
  })

  it("should pass the warrants fetcher to reportStream", async () => {
    ;(userAccess as jest.Mock).mockReturnValue({ [Permission.ViewReports]: true })

    await generateWarrantsReport(mockDatabase, mockUser, query, mockReply)

    const [capturedStream, capturedFetcher] = (reportStream as jest.Mock).mock.lastCall

    expect(capturedStream).toBeInstanceOf(Readable)

    const mockProcessBatch = jest.fn()
    await capturedFetcher(mockProcessBatch)

    expect(warrants).toHaveBeenCalledWith(mockDatabase.readonly, mockUser, query, mockProcessBatch)
  })
})
