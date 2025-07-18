import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import postgres from "postgres"

type Options = { readOnly?: boolean }

export default ({ readOnly = false }: Options = {}): postgres.Sql<{}> => {
  const dbConfig = createDbConfig(readOnly)
  const sql = postgres({
    ...dbConfig,
    max: 20,
    max_lifetime: undefined
    // debug: (connection, query, params) => {
    //   console.log("SQL Query:", query)
    //   console.log("Parameters:", params)
    // }
  })

  return sql
}
