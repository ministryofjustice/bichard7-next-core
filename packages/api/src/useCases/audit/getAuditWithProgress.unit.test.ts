import type { AuditWithProgressDto } from "@moj-bichard7/common/types/Audit"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { subDays } from "date-fns"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { fetchAuditWithProgress } from "../../services/db/audit/fetchAuditWithProgress"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { NotFoundError } from "../../types/errors/NotFoundError"
import { getAuditWithProgress } from "./getAuditWithProgress"

jest.mock("../../services/db/audit/fetchAuditWithProgress")

describe("getAuditWithProgress", () => {
  const mockDatabase = {} as unknown as jest.Mocked<WritableDatabaseConnection>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("gets an audit and converts it to a dto", async () => {
    ;(fetchAuditWithProgress as jest.Mock).mockImplementation(() =>
      Promise.resolve({ audit_id: 1, created_when: new Date(), from_date: subDays(new Date(), 7), to_date: new Date() })
    )

    const result = await getAuditWithProgress(mockDatabase, 1, {
      groups: [UserGroup.Supervisor]
    } as User)

    expect(isError(result)).toBe(false)
    expect(fetchAuditWithProgress).toHaveBeenCalled()
    expect((result as AuditWithProgressDto).auditId).toBe(1)
  })

  it("returns an error due to lack of user permissions", async () => {
    const result = await getAuditWithProgress(mockDatabase, 1, {
      groups: [UserGroup.GeneralHandler]
    } as User)

    expect(result).toBeInstanceOf(NotAllowedError)
  })

  it("returns an error if the db call returns an error", async () => {
    ;(fetchAuditWithProgress as jest.Mock).mockImplementation(() => Promise.resolve(new Error("Test error message")))

    const result = await getAuditWithProgress(mockDatabase, 1, {
      groups: [UserGroup.Supervisor]
    } as User)

    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toBe("Test error message")
  })

  it("returns an error if the audit was not found", async () => {
    ;(fetchAuditWithProgress as jest.Mock).mockImplementation(() => Promise.resolve(null))

    const result = await getAuditWithProgress(mockDatabase, 1, {
      groups: [UserGroup.Supervisor]
    } as User)

    expect(result).toBeInstanceOf(NotFoundError)
  })
})
