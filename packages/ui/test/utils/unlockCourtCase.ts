import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"

export default async (caseId: number): Promise<boolean> => {
  const dataSource = await getDataSource()
  await dataSource
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      errorLockedByUsername: null,
      triggerLockedByUsername: null
    })
    .where("errorId = :id", { id: caseId })
    .execute()

  return true
}
