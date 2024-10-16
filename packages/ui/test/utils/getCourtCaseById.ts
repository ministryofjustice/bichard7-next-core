import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"

export const getCourtCaseById = async (caseId: number): Promise<CourtCase> => {
  const dataSource = await getDataSource()
  const repo = dataSource.getRepository(CourtCase)
  const query = repo.createQueryBuilder("courtCase").andWhere({ errorId: caseId })

  return query.getOne().catch((error) => error)
}
