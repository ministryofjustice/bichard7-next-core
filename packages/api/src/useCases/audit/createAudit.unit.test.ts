import type { CreateAudit } from "@moj-bichard7/common/contracts/CreateAudit"
import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { format, subWeeks } from "date-fns"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { createAudit } from "./createAudit"

describe("createAudit", () => {
  const mockDatabase = {
    transaction: jest.fn()
  } as unknown as jest.Mocked<WritableDatabaseConnection>

  const createAuditBody: CreateAudit = {
    fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
    includedTypes: ["Triggers", "Exceptions"],
    resolvedByUsers: ["user1"],
    toDate: format(new Date(), "yyyy-MM-dd"),
    volumeOfCases: 20
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("runs the transaction if the user is a supervisor", async () => {
    mockDatabase.transaction.mockResolvedValue({ auditId: 1 })

    const result = await createAudit(mockDatabase, createAuditBody, {
      groups: [UserGroup.Supervisor]
    } as User)

    expect(mockDatabase.transaction).toHaveBeenCalled()
    expect(isError(result)).toBe(false)
    expect((result as AuditDto).auditId).toBe(1)
  })

  it("returns an error due to lack of user permissions", async () => {
    const audit = await createAudit(mockDatabase, createAuditBody, {
      groups: [UserGroup.GeneralHandler]
    } as User)

    expect(audit).toBeInstanceOf(NotAllowedError)
  })

  it("returns an error if the transaction returns an error", async () => {
    mockDatabase.transaction.mockRejectedValue(new Error("Test error message"))

    const result = await createAudit(mockDatabase, createAuditBody, {
      groups: [UserGroup.Supervisor]
    } as User)

    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toBe("Test error message")
  })
})
