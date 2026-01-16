import "../../tests/helpers/setEnvironmentVariables"

import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import postgres from "postgres"

import { setupCase } from "../../tests/helpers/setupCase"
import ResolutionStatus from "../../types/ResolutionStatus"
import checkDb from "./check_db"

const dbConfig = createDbConfig()
const sql = postgres({
  ...dbConfig,
  types: {
    date: {
      to: 25,
      from: [1082],
      serialize: (x: string): string => x,
      parse: (x: string): Date => {
        return new Date(x)
      }
    }
  }
})

describe("check db", () => {
  beforeEach(async () => {
    await sql`TRUNCATE br7own.error_list RESTART IDENTITY CASCADE`
  })

  afterAll(async () => {
    await sql.end()
  })

  it("with a case Unresolved error status and is locked", async () => {
    const caseDb = await setupCase(sql, ResolutionStatus.UNRESOLVED, "username")

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id, autoResubmit: false } })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("s3TaskDataPath", `${caseDb.message_id}.json`)
  })

  it("will complete if the case is not submitted status", async () => {
    const caseDb = await setupCase(sql, ResolutionStatus.UNRESOLVED, "username")

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id, autoResubmit: false } })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("s3TaskDataPath", `${caseDb.message_id}.json`)
  })

  it("will fail if the case doesn't have a lock", async () => {
    const caseDb = await setupCase(sql, ResolutionStatus.UNRESOLVED, undefined)

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id, autoResubmit: false } })

    expect(result.status).toBe("FAILED")
  })

  it("will fail if the case has the submitted error status", async () => {
    const caseDb = await setupCase(sql, ResolutionStatus.SUBMITTED, "user.name")

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id, autoResubmit: false } })

    expect(result.status).toBe("FAILED")
  })

  it("will fail if the case has the resolved error status", async () => {
    const caseDb = await setupCase(sql, ResolutionStatus.RESOLVED, "user.name")

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id, autoResubmit: false } })

    expect(result.status).toBe("FAILED")
  })

  describe("with auto resubmit should complete with error in logs", () => {
    it("if the case is locked to a user", async () => {
      const caseDb = await setupCase(sql, ResolutionStatus.UNRESOLVED, "username")

      const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id, autoResubmit: true } })

      expect(result.status).toBe("COMPLETED")
      expect(result.logs?.[0].log).toMatch(/^\[AutoResubmit]/)
    })

    it("if the case is Submitted", async () => {
      const caseDb = await setupCase(sql, ResolutionStatus.SUBMITTED, undefined)

      const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id, autoResubmit: true } })

      expect(result.status).toBe("COMPLETED")
      expect(result.logs?.[0].log).toMatch(/^\[AutoResubmit]/)
    })

    it("should be Completed if the case is Unresolved and not locked", async () => {
      const caseDb = await setupCase(sql, ResolutionStatus.UNRESOLVED, undefined)

      const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id, autoResubmit: true } })

      expect(result.status).toBe("COMPLETED")
    })
  })
})
