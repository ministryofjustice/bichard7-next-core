import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type User from "services/entities/User"
import deleteFromDynamoTable from "../../../test/utils/deleteFromDynamoTable"
import { auditLogFileDownload, type LogQuery } from "./auditLogFileDownload"

describe("AuditLogFileDownload", () => {
  beforeEach(async () => {
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
  })

  it("will return 403 error without the correct permission", async () => {
    const user = { groups: [UserGroup.GeneralHandler] } as User
    const query = {} as LogQuery

    const result = await auditLogFileDownload(user, query)

    if (!isError(result)) {
      throw new Error("Expecting this to be an error")
    }

    expect(result.message).toBe("403")
  })

  it("will return 400 error when neither 'csvDownload' or 'xlsxDownload' are 'true'", async () => {
    const user = { groups: [UserGroup.Supervisor] } as User
    const query = { csvDownload: "false", xlsxDownload: "false" } as LogQuery

    const result = await auditLogFileDownload(user, query)

    if (!isError(result)) {
      throw new Error("Expecting this to be an error")
    }

    expect(result.message).toBe("400")
  })

  it("will return 400 error when both 'csvDownload' and 'xlsxDownload' are 'true'", async () => {
    const user = { groups: [UserGroup.Supervisor] } as User
    const query = { csvDownload: "true", xlsxDownload: "true" } as LogQuery

    const result = await auditLogFileDownload(user, query)

    if (!isError(result)) {
      throw new Error("Expecting this to be an error")
    }

    expect(result.message).toBe("400")
  })

  it("will return 400 error when 'fromDate' isn't a Date", async () => {
    const user = { groups: [UserGroup.Supervisor] } as User
    const query = { csvDownload: "true", fromDate: "1234", toDate: "2026-01-01", reportType: "bails" } as LogQuery

    const result = await auditLogFileDownload(user, query)

    if (!isError(result)) {
      throw new Error("Expecting this to be an error")
    }

    expect(result.message).toBe("400")
  })

  it("will return 400 error when 'toDate' isn't a Date", async () => {
    const user = { groups: [UserGroup.Supervisor] } as User
    const query = { csvDownload: "true", fromDate: "2026-01-01", toDate: "abc", reportType: "bails" } as LogQuery

    const result = await auditLogFileDownload(user, query)

    if (!isError(result)) {
      throw new Error("Expecting this to be an error")
    }

    expect(result.message).toBe("400")
  })

  it("creates an audit log for CSV download", async () => {
    const user = { username: "user.name", groups: [UserGroup.Supervisor] } as User
    const query = { csvDownload: "true", fromDate: "2026-01-01", toDate: "2026-01-30", reportType: "bails" } as LogQuery

    const result = await auditLogFileDownload(user, query)

    if (isError(result)) {
      throw new Error("Expecting this to be an error")
    }

    expect(result).toBeUndefined()
  })

  it("creates an audit log for XLSX download", async () => {
    const user = { username: "user.name", groups: [UserGroup.Supervisor] } as User
    const query = { xlsxDownload: "true", reportType: "automation rate" } as LogQuery

    const result = await auditLogFileDownload(user, query)

    if (isError(result)) {
      throw new Error("Expecting this to be an error")
    }

    expect(result).toBeUndefined()
  })
})
