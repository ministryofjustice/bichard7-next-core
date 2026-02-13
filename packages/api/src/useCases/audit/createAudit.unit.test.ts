import type { CreateAudit } from "@moj-bichard7/common/contracts/CreateAudit"
import type { User } from "@moj-bichard7/common/types/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { format, subWeeks } from "date-fns"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { createAudit } from "./createAudit"

describe("createAudit", () => {
  let mockDatabase: jest.Mocked<Partial<WritableDatabaseConnection>>

  const createAuditBody: CreateAudit = {
    fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
    includedTypes: ["Triggers", "Exceptions"],
    resolvedByUsers: ["user1"],
    toDate: format(new Date(), "yyyy-MM-dd"),
    volumeOfCases: 20
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockDatabase = {
      transaction: jest.fn()
    }
  })

  it("runs the transaction if the user is a supervisor", async () => {
    await createAudit(mockDatabase as WritableDatabaseConnection, createAuditBody, {
      groups: [UserGroup.Supervisor]
    } as User)

    expect(mockDatabase?.transaction).toHaveBeenCalled()
  })

  it("returns an error due to lack of user permissions", async () => {
    const audit = await createAudit(mockDatabase as WritableDatabaseConnection, createAuditBody, {
      groups: [UserGroup.GeneralHandler]
    } as User)

    expect(audit).toBeInstanceOf(NotAllowedError)
  })
})
