import type { AuditCasesQuery } from "@moj-bichard7/common/contracts/AuditCasesQuery"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { getAuditCases } from "./getAuditCases"

describe("getAuditCases", () => {
  const mockDatabase = {
    transaction: jest.fn()
  } as unknown as jest.Mocked<WritableDatabaseConnection>

  const auditCasesQuery: AuditCasesQuery = {
    maxPerPage: 50,
    order: "asc",
    pageNum: 1
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("runs the transaction if the user is a supervisor", async () => {
    mockDatabase.transaction.mockResolvedValue({ cases: [] })

    const result = await getAuditCases(mockDatabase, auditCasesQuery, {
      groups: [UserGroup.Supervisor]
    } as User)

    expect(mockDatabase.transaction).toHaveBeenCalled()
    expect(isError(result)).toBe(false)
  })

  it("returns an error due to lack of user permissions", async () => {
    const result = await getAuditCases(mockDatabase, auditCasesQuery, {
      groups: [UserGroup.GeneralHandler]
    } as User)

    expect(result).toBeInstanceOf(NotAllowedError)
  })

  it("returns an error if the transaction returns an error", async () => {
    mockDatabase.transaction.mockRejectedValue(new Error("Test error message"))

    const result = await getAuditCases(mockDatabase, auditCasesQuery, {
      groups: [UserGroup.Supervisor]
    } as User)

    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toBe("Test error message")
  })
})
