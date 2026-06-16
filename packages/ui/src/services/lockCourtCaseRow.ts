import type { EntityManager } from "typeorm"
import CourtCase from "./entities/CourtCase"

export const lockCourtCaseRow = async (db: EntityManager, caseId: number) => {
  await db
    .createQueryBuilder(CourtCase, "courtCase")
    .setLock("pessimistic_write")
    .where("courtCase.errorId = :caseId", { caseId })
    .getOne()
}
