import pgPromise from "pg-promise"

export const getTableName = (tableName) => {
  const pgp = pgPromise()
  return new pgp.helpers.TableName({ table: tableName, schema: "br7own" })
}

export default { getTableName }
