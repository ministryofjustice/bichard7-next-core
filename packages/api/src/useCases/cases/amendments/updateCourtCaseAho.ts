import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { isPncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import { type PromiseResult } from "@moj-bichard7/common/types/Result"
import serialiseToAhoXml from "@moj-bichard7/core/lib/serialise/ahoXml/serialiseToXml"
import serialiseToPncUpdateDatasetXml from "@moj-bichard7/core/lib/serialise/pncUpdateDatasetXml/serialiseToXml"

import type { TransactionConnection } from "../../../types/DatabaseGateway"

export const updateCourtCaseAho = async (
  tx: TransactionConnection,
  courtCaseId: number,
  updatedHo: AnnotatedHearingOutcome | PncUpdateDataset
): PromiseResult<void> => {
  const updatedHoXml = isPncUpdateDataset(updatedHo)
    ? serialiseToPncUpdateDatasetXml(updatedHo, false)
    : serialiseToAhoXml(updatedHo, false)

  updatedHo.Exceptions = []

  try {
    await tx.connection`
      UPDATE br7own.error_list
      SET
        updated_hearing_outcome = ${updatedHoXml},
        updated_hearing_outcome_json = ${tx.connection.json(updatedHo)},
        user_updated_flag = 1
      WHERE error_id = ${courtCaseId}
    `
  } catch (error) {
    return new Error(`Couldn't update court case ${courtCaseId}: ${(error as Error).message}`)
  }
}
