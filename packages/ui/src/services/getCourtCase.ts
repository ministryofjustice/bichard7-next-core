import type { DataSource, EntityManager } from "typeorm"

import type PromiseResult from "../types/PromiseResult"

import CourtCase from "./entities/CourtCase"

const getCourtCase = (dataSource: DataSource | EntityManager, courtCaseId: number): PromiseResult<CourtCase | null> => {
  const repository = dataSource.getRepository(CourtCase)
  const query = repository
    .createQueryBuilder("courtCase")
    .andWhere({ errorId: courtCaseId })
    .leftJoinAndSelect("courtCase.triggers", "trigger")
    .leftJoinAndSelect("courtCase.notes", "note")
    .addOrderBy("note.createdAt", "ASC")

  return query.getOne().catch((error) => error)
}

export default getCourtCase
