import type { EntityManager } from "typeorm"

export const lockErrorListRow = async (db: EntityManager, caseId: number) => {
  //  query used instead connection in entityManager
  await db.query("SELECT * from br7own.error_list el WHERE error_id = $1 FOR UPDATE", [caseId])
}
