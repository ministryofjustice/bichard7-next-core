import type { CaseRow } from "@moj-bichard7/common/types/Case"
import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"
import { isError } from "@moj-bichard7/common/types/Result"
import type { Sql } from "postgres"

const fetchPoliceQuery = async (db: Sql<{}>, messageId: string): Promise<PoliceQueryResult | undefined | Error> => {
  const caseResult = await db<
    CaseRow[]
  >`SELECT hearing_outcome FROM br7own.error_list WHERE message_id = ${messageId}`.catch((error: Error) => error)
  if (isError(caseResult)) {
    return caseResult
  }

  if (caseResult.length === 0) {
    return Error(`Case with message ID ${messageId} not found in the database`)
  }

  return caseResult[0].hearing_outcome?.PncQuery ?? undefined
}

export default fetchPoliceQuery
