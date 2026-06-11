import type { TransactionConnection } from "../../../types/DatabaseGateway"

export const function_placeholder = async (db: TransactionConnection, caseId: number, userId: string) => {
  try {
    // keep this specific connection open and hold onto that FOR UPDATE lock until I see next command
    await db.connection`BEGIN`
    await db.connection`SELECT * from br7own.error_list el WHERE error_id = ${caseId} FOR UPDATE`

    //   mark it as locked in the database

    const [updateCase] = await db.connection`
    UPDATE br7own.error_list 
    SET error_locked_by_id = ${userId} 
    WHERE error_id = ${caseId}
    RETURNING *
  `

    //    save everything and unlock
    await db.connection`COMMIT`

    // retur the updated case data so API can send it to UI
    return updateCase
  } catch (error) {
    // if anything fails, it unlocks the row
    await db.connection`ROLLBACK`

    // throw an error so we know something failed
    throw error
  }
}
