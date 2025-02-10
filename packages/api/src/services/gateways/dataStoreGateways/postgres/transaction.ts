import type postgres from "postgres"

export const transaction = async (sql: postgres.Sql, callback: (callbackSql: postgres.Sql) => unknown) => {
  // Create a `TRANSACTION`
  const resultOfTransaction = await sql.begin("read write", async (transactionSql) => {
    // Create a `SAVEPOINT` to `ROLLBACK` to.
    const resultOfSavePoint = await transactionSql.savepoint(async (callbackSql) => {
      // We need the `sql` context to be given to the callback, to track the `ROLLBACK` or `COMMIT`
      //   - If an error happens to will `ROLLBACK` changes to the `SAVEPOINT`.
      //   - If no errors happen, we will `COMMIT`.
      return await callback(callbackSql)
    })
    return resultOfSavePoint
  })

  return resultOfTransaction
}
