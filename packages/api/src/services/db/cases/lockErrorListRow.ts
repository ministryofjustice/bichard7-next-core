import type { TransactionConnection } from "../../../types/DatabaseGateway"

export const lockErrorListRow = async (db: TransactionConnection, caseId: number) => {
  await db.connection`SELECT * from br7own.error_list el WHERE error_id = ${caseId} FOR UPDATE`
}
