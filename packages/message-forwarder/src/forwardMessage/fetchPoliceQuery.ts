import { CaseRowSchema } from "@moj-bichard7/common/types/Case"
import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"
import { isError } from "@moj-bichard7/common/types/Result"
import type { Sql } from "postgres"

const caseRowResultSchema = CaseRowSchema.pick({ hearing_outcome: true }).array()

const fetchPoliceQuery = async (db: Sql<{}>, messageId: string): Promise<PoliceQueryResult | undefined | Error> => {
  const caseRowResult = await db`SELECT hearing_outcome FROM br7own.error_list WHERE message_id = ${messageId}`.catch(
    (error: Error) => error
  )
  if (isError(caseRowResult)) {
    return caseRowResult
  }

  if (caseRowResult.length === 0) {
    return new Error(`Case with message ID ${messageId} not found in the database`)
  }

  const parsedCaseRowResult = caseRowResultSchema.safeParse(caseRowResult)
  if (!parsedCaseRowResult.success) {
    return new Error("Schema validation failed for error_list SELECT query")
  }

  return parsedCaseRowResult.data[0].hearing_outcome?.PncQuery ?? undefined
}

export default fetchPoliceQuery
