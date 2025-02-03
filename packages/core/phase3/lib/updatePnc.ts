import { isError } from "@moj-bichard7/common/types/Result"

import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import type PncUpdateRequest from "../types/PncUpdateRequest"

import generatePncUpdateExceptionFromMessage, {
  isPncLockError
} from "../exceptions/generatePncUpdateExceptionFromMessage"

export const MAXIMUM_PNC_LOCK_ERROR_RETRIES = 3
const DELAY_FOR_PNC_LOCK_ERROR_RETRY = parseInt(process.env.DELAY_FOR_PNC_LOCK_ERROR_RETRY ?? "10000")

const delayForPncLockErrorRetry = () => new Promise((resolve) => setTimeout(resolve, DELAY_FOR_PNC_LOCK_ERROR_RETRY))

const updatePnc = async (
  pncUpdateDataset: PncUpdateDataset,
  pncUpdateRequest: PncUpdateRequest,
  pncGateway: PncGatewayInterface
) => {
  const correlationId = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  for (let pncLockErrorRetries = 0; pncLockErrorRetries < MAXIMUM_PNC_LOCK_ERROR_RETRIES; pncLockErrorRetries++) {
    const pncUpdateResult = await pncGateway.update(pncUpdateRequest, correlationId)

    if (isError(pncUpdateResult)) {
      const pncExceptions = pncUpdateResult.messages.map(generatePncUpdateExceptionFromMessage)

      if (pncExceptions.some(isPncLockError) && pncLockErrorRetries !== MAXIMUM_PNC_LOCK_ERROR_RETRIES - 1) {
        await delayForPncLockErrorRetry()
      } else {
        pncUpdateDataset.Exceptions.push(...pncExceptions)

        return pncUpdateResult
      }
    } else {
      return pncUpdateResult
    }
  }
}

export default updatePnc
