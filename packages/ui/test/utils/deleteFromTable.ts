import getDataSource from "../../src/services/getDataSource"

const deleteFromTable = async (tableName: string) => {
  const dataSource = await getDataSource()
  await dataSource.query(`TRUNCATE TABLE br7own.${tableName} CASCADE;`)
}

export default deleteFromTable
