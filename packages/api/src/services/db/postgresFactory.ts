import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import postgres from "postgres"

export default (): postgres.Sql<{}> => {
  const dbConfig = createDbConfig()
  const sql = postgres({
    ...dbConfig
    // debug: (connection, query, params) => {
    //   console.log("SQL Query:", query)
    //   console.log("Parameters:", params)
    // }
  })

  return sql
}
