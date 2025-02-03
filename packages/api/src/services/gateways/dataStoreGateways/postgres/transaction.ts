import type postgres from "postgres"

export const transaction = async (sql: postgres.Sql, callback: (sql: postgres.Sql) => unknown) => {
  // Create a `TRANSACTION`
  const resultOfTransaction = await sql.begin("read write", async (sql) => {
    // Create a `SAVEPOINT` to `ROLLBACK` to.
    const resultOfSavePoint = await sql.savepoint(async (sql) => {
      // We need the `sql` context to be given to the callback, to track the `ROLLBACK` or `COMMIT`
      //   - If an error happens to will `ROLLBACK` changes to the `SAVEPOINT`.
      //   - If no errors happen, we will `COMMIT`.
      return await callback(sql)
    })
    return resultOfSavePoint
  })

  return resultOfTransaction
}
