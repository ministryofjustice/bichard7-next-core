import type { TriggerRow } from "@moj-bichard7/common/types/Trigger"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { TransactionConnection } from "../../../types/DatabaseGateway"

export const getAllTriggers = async (tx: TransactionConnection, courtCaseId: number): PromiseResult<TriggerRow[]> => {
  const allTriggersResult = await tx.connection<TriggerRow[]>`
    SELECT * FROM br7own.error_list_triggers
    WHERE error_id = ${courtCaseId}
  `.catch((error: Error) => error)

  if (isError(allTriggersResult)) {
    return new Error(`Couldn't fetch triggers for court case ${courtCaseId}: ${allTriggersResult.message}`)
  }

  return allTriggersResult
}
