import type PromiseResult from "types/PromiseResult"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"

export const getCourtCaseById = async (caseId: number): PromiseResult<CourtCase | null> => {
  const dataSource = await getDataSource()
  const repo = dataSource.getRepository(CourtCase)
  const query = repo.createQueryBuilder("courtCase").andWhere({ errorId: caseId })

  return query.getOne().catch((error: Error) => error)
}
