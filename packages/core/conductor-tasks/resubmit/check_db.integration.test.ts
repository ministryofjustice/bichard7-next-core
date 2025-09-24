import "../../tests/helpers/setEnvironmentVariables"

import type { CaseRow } from "@moj-bichard7/common/types/Case"

import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import { isError } from "@moj-bichard7/common/types/Result"
import postgres from "postgres"

import insertErrorListRecord from "../../lib/database/insertErrorListRecord"
import generateMockPhase1Result from "../../phase1/tests/helpers/generateMockPhase1Result"
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

const setupCase = async (resolutionStatus: ResolutionStatus, lockedBy?: string): Promise<CaseRow> => {
  const phase1Result = generateMockPhase1Result()
  const recordId = await insertErrorListRecord(sql, phase1Result)

  let query = sql``
  if (lockedBy) {
    query = sql`, error_locked_by_id = ${lockedBy}`
  }

  const update = await sql`
      UPDATE br7own.error_list
      SET error_status = ${resolutionStatus}${query}
      WHERE error_id = ${recordId}
    `

  if (isError(update)) {
    throw update
  }

  const result = await sql`SELECT * FROM br7own.error_list el WHERE el.error_id = ${recordId}`

  if (result.length !== 1) {
    throw new Error("Wrong number of Cases found")
  }

  return result[0] as CaseRow
}

describe("check db", () => {
  beforeEach(async () => {
    await sql`DELETE FROM br7own.error_list`
  })

  it("with a case submitted error status and is locked", async () => {
    const caseDb = await setupCase(ResolutionStatus.SUBMITTED, "username")

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id } })

    expect(result.status).toBe("COMPLETED")
  })

  it("contains output data", async () => {
    const caseDb = await setupCase(ResolutionStatus.SUBMITTED, "username")

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id } })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("messageId", caseDb.message_id)
  })

  it("will fail if the case is not submitted status", async () => {
    const caseDb = await setupCase(ResolutionStatus.UNRESOLVED, "username")

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id } })

    expect(result.status).toBe("FAILED")
  })

  it("will fail if the case doesn't have a lock", async () => {
    const caseDb = await setupCase(ResolutionStatus.SUBMITTED, undefined)

    const result = await checkDb.execute({ inputData: { messageId: caseDb.message_id } })

    expect(result.status).toBe("FAILED")
  })
})
