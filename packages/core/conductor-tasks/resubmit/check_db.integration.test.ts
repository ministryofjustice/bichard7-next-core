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

  it("with a case submitted error status and is locked", async () => {
    const caseDb = await setupCase(sql, ResolutionStatus.SUBMITTED, "username")

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id } })

    expect(result.status).toBe("COMPLETED")
  })

  it("contains output data", async () => {
    const caseDb = await setupCase(sql, ResolutionStatus.SUBMITTED, "username")

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id } })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("messageId", caseDb.message_id)
  })

  it("will fail if the case is not submitted status", async () => {
    const caseDb = await setupCase(sql, ResolutionStatus.UNRESOLVED, "username")

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id } })

    expect(result.status).toBe("FAILED")
  })

  it("will fail if the case doesn't have a lock", async () => {
    const caseDb = await setupCase(sql, ResolutionStatus.SUBMITTED, undefined)

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id } })

    expect(result.status).toBe("FAILED")
  })
})
