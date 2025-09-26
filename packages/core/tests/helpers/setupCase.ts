import type { CaseRow } from "@moj-bichard7/common/types/Case"
import type { Sql } from "postgres"

import { isError } from "@moj-bichard7/common/types/Result"

import insertErrorListRecord from "../../lib/database/insertErrorListRecord"
import generateMockPhase1Result from "../../phase1/tests/helpers/generateMockPhase1Result"
import ResolutionStatus from "../../types/ResolutionStatus"

export const setupCase = async (
  sql: Sql,
  resolutionStatus: ResolutionStatus = ResolutionStatus.SUBMITTED,
  lockedBy?: string
): Promise<CaseRow> => {
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
