import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import { isError } from "@moj-bichard7/common/types/Result"
import type { Sql } from "postgres"

const getTriggersCount = async (db: Sql, correlationId: string): PromiseResult<number> => {
  const triggers = await db`SELECT COUNT(*) FROM br7own.error_list_triggers AS T
    INNER JOIN br7own.error_list AS E ON T.error_id = E.error_id
    WHERE E.message_id = ${correlationId}`.catch((error: Error) => error)

  return isError(triggers) ? triggers : Number(triggers[0].count)
}

export default getTriggersCount
