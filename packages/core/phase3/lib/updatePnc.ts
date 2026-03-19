import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { isError } from "@moj-bichard7/common/types/Result"

import type PoliceGateway from "../../types/PoliceGateway"
import type PoliceUpdateRequest from "../types/PoliceUpdateRequest"

import createPoliceExceptionGenerator from "../../lib/exceptions/PoliceExceptionGenerator/createPoliceExceptionGenerator"

export const MAXIMUM_PNC_LOCK_ERROR_RETRIES = 3
const DELAY_FOR_PNC_LOCK_ERROR_RETRY = parseInt(process.env.DELAY_FOR_PNC_LOCK_ERROR_RETRY ?? "10000")

const policeExceptionGenerator = createPoliceExceptionGenerator()

const delayForPncLockErrorRetry = () => new Promise((resolve) => setTimeout(resolve, DELAY_FOR_PNC_LOCK_ERROR_RETRY))

const updatePnc = async (
  pncUpdateDataset: PncUpdateDataset,
  pncUpdateRequest: PoliceUpdateRequest,
  policeGateway: PoliceGateway
) => {
  const correlationId = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  for (let pncLockErrorRetries = 0; pncLockErrorRetries < MAXIMUM_PNC_LOCK_ERROR_RETRIES; pncLockErrorRetries++) {
    const pncUpdateResult = await policeGateway.update(pncUpdateRequest, correlationId, pncUpdateDataset)

    if (!isError(pncUpdateResult)) {
      return pncUpdateResult
    }

    const pncExceptions = pncUpdateResult.messages.map(policeExceptionGenerator.generateFromUpdateMessage)

    if (
      pncExceptions.some(policeExceptionGenerator.isLockError) &&
      pncLockErrorRetries !== MAXIMUM_PNC_LOCK_ERROR_RETRIES - 1
    ) {
      await delayForPncLockErrorRetry()
    } else {
      pncUpdateDataset.Exceptions.push(...pncExceptions)

      return pncUpdateResult
    }
  }
}

export default updatePnc
