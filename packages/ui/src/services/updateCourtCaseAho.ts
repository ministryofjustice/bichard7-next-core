import { DataSource, EntityManager, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"

const updateCourtCaseAho = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  updatedHo: string,
  userUpdated: boolean
): Promise<UpdateResult | Error> =>
  dataSource
    .getRepository(CourtCase)
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      updatedHearingOutcome: updatedHo,
      userUpdatedFlag: userUpdated ? 1 : 0
    })
    .where("error_id = :id", { id: courtCaseId })
    .returning("*")
    .execute()
    .catch((error: Error) => error)

export default updateCourtCaseAho
