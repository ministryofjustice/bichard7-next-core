import shouldExcludePleaAndAdjudication from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/shouldExcludePleaAndAdjudication"
import { addDisposalRequestSchema } from "@moj-bichard7/core/schemas/leds/addDisposalRequest"
import type { AddDisposalRequest, ArrestOffence, Offence } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { AdditionalArrestOffences } from "@moj-bichard7/core/types/leds/DisposalRequest"
import type { MockAddDisposalRequest } from "../../../types/MockAddDisposalRequest"

const filterPleaAndAdjudication = (
  offence: Offence | ArrestOffence,
  isCarriedForwardOrReferredToCourtCase: boolean
) => {
  const shouldExclude = offence.disposalResults
    ? shouldExcludePleaAndAdjudication(offence.disposalResults, isCarriedForwardOrReferredToCourtCase)
    : false

  offence.plea = !shouldExclude ? offence.plea : undefined
  offence.adjudication = !shouldExclude ? offence.adjudication : undefined
}

const sanitizeOffences = (offences: Offence[] | undefined, isCarriedForwardOrReferredToCourtCase: boolean): void => {
  if (!offences || offences.length === 0) {
    return
  }

  offences?.forEach((offence) => {
    filterPleaAndAdjudication(offence, isCarriedForwardOrReferredToCourtCase)

    offence.cjsOffenceCode = offence.cjsOffenceCode.slice(0, 7)
    offence.disposalResults?.forEach(
      (disposal) => (disposal.disposalQualifiers = disposal.disposalQualifiers?.map((dq) => dq.trim()))
    )
  })
}

const sanitizeAdditionalOffences = (
  additionalArrestOffences: AdditionalArrestOffences[] | undefined,
  isCarriedForwardOrReferredToCourtCase: boolean
): void => {
  if (!additionalArrestOffences || additionalArrestOffences.length === 0) {
    return
  }

  additionalArrestOffences?.forEach((additionalArrestOffence) => {
    additionalArrestOffence.additionalOffences.forEach((offence) => {
      filterPleaAndAdjudication(offence, isCarriedForwardOrReferredToCourtCase)
    })
  })
}

const convertAddDisposalRequestMockJsonToLeds = (mockJson: MockAddDisposalRequest): AddDisposalRequest => {
  const isCarriedForwardOrReferredToCourtCase = !!mockJson.carryForward || !!mockJson.referToCourtCase

  sanitizeOffences(mockJson.offences, isCarriedForwardOrReferredToCourtCase)
  sanitizeAdditionalOffences(mockJson.additionalArrestOffences, isCarriedForwardOrReferredToCourtCase)

  if (mockJson.referToCourtCase) {
    mockJson.referToCourtCase.reference = mockJson.referToCourtCase.reference.split("/")[1]
  }

  return addDisposalRequestSchema.parse(mockJson)
}

export default convertAddDisposalRequestMockJsonToLeds
