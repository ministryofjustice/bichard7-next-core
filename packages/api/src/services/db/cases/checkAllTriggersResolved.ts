import { type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

export default async (database: DatabaseConnection, caseId: number): PromiseResult<boolean> => {
  const result = await database.connection<{ allResolved: boolean }[]>`
    SELECT NOT EXISTS (
        SELECT 1 
        FROM br7own.error_list_triggers 
        WHERE case_id = ${caseId}  
            AND status != 2
        ) AS "allResolved"
    `.catch((error: Error) => error)

  if (result instanceof Error) {
    throw result
  }

  return result[0].allResolved
}
