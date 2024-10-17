import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import postgres from "postgres"

const dbConfig = createDbConfig()

const getTriggersCount = async (correlationId: string): Promise<number> => {
  const db = postgres(dbConfig)

  const triggers = await db`SELECT COUNT(*) FROM br7own.error_list_triggers AS T
    INNER JOIN br7own.error_list AS E ON T.error_id = E.error_id
    WHERE E.message_id = ${correlationId}`

  return Number(triggers[0].count)
}

export default getTriggersCount
