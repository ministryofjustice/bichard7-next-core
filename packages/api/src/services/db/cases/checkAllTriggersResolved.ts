import { type PromiseResult } from "@moj-bichard7/common/types/Result"
import { isError } from "lodash"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

export default async (database: DatabaseConnection, caseId: number): PromiseResult<boolean> => {
  const result = await database.connection<{ allResolved: boolean }[]>`
    SELECT NOT EXISTS (
        SELECT 1 
        FROM br7own.error_list_triggers 
        WHERE error_id = ${caseId}  
            AND status != 2
        ) AS "allResolved"
    `.catch((error: Error) => error)

  if (isError(result)) {
    return new Error(`Failed to check if all triggers are resolved for case ${caseId}: ${result.message}`)
  }

  return result[0].allResolved
}
