import { isError } from "../../src/types/Result"
import insertAuditLogIntoDynamoTable from "./insertAuditLogIntoDynamoTable"

const insertManyIntoDynamoTable = async (records: Record<string, unknown>[]) => {
  while (records.length) {
    const recordsToInsert = records.splice(0, 100)
    const insertAuditLogResult = await insertAuditLogIntoDynamoTable(recordsToInsert)

    if (isError(insertAuditLogResult)) {
      throw insertAuditLogResult
    }
  }
}

export default insertManyIntoDynamoTable
