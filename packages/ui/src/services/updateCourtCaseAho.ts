import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import { isPncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import serialiseToAhoXml from "@moj-bichard7/core/lib/serialise/ahoXml/serialiseToXml"
import serialiseToPncUpdateDatasetXml from "@moj-bichard7/core/lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import type { DataSource, EntityManager, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"

const updateCourtCaseAho = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  updatedHo: AnnotatedHearingOutcome | PncUpdateDataset
): Promise<UpdateResult | Error> => {
  const updatedHoXml = isPncUpdateDataset(updatedHo)
    ? serialiseToPncUpdateDatasetXml(updatedHo, false)
    : serialiseToAhoXml(updatedHo, false)

  return await dataSource
    .getRepository(CourtCase)
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      updatedHearingOutcome: updatedHoXml,
      updatedHearingOutcomeJson: updatedHo,
      userUpdatedFlag: 1
    })
    .where("error_id = :id", { id: courtCaseId })
    .returning("*")
    .execute()
    .catch((error: Error) => error)
}

export default updateCourtCaseAho
