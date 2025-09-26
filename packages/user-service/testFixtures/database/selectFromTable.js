import getTestConnection from "../getTestConnection"
import { getTableName } from "./helpers"

const selectFromTable = async (tableName, whereColumn, whereValue, orderByColumn) => {
  const connection = getTestConnection()
  const isWhereClause = whereColumn && whereValue

  const selectQuery = `
    SELECT * FROM $\{table\}
    ${isWhereClause ? `WHERE ${whereColumn} = $\{value\}` : ""}
    ${orderByColumn ? `ORDER BY ${orderByColumn}` : ""}`

  const table = getTableName(tableName)
  const whereClause = isWhereClause ? { value: whereValue } : {}

  return connection.any(selectQuery, { table, ...whereClause })
}

export default selectFromTable
