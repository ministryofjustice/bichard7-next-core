import { DataSource, EntityManager } from "typeorm"
import CourtCase from "./entities/CourtCase"
import PromiseResult from "../types/PromiseResult"

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
