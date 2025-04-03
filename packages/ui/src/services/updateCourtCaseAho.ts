import type { DataSource, EntityManager, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"

const updateCourtCaseAho = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  updatedHo: string
): Promise<UpdateResult | Error> =>
  await dataSource
    .getRepository(CourtCase)
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      updatedHearingOutcome: updatedHo,
      userUpdatedFlag: 1
    })
    .where("error_id = :id", { id: courtCaseId })
    .returning("*")
    .execute()
    .catch((error: Error) => error)

export default updateCourtCaseAho
