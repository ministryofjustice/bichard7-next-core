import shouldExcludePleaAndAdjudication from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/shouldExcludePleaAndAdjudication"
import { addDisposalRequestSchema } from "@moj-bichard7/core/schemas/leds/addDisposalRequest"
import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { MockAddDisposalRequest } from "../../../types/MockAddDisposalRequest"

const convertAddDisposalRequestMockJsonToLeds = (mockJson: MockAddDisposalRequest): AddDisposalRequest => {
  const isCarriedForwardOrReferredToCourtCase = !!mockJson.carryForward || !!mockJson.referToCourtCase

  mockJson.offences?.forEach((offence) => {
    const excludePleaAndAdjudication = offence.disposalResults
      ? shouldExcludePleaAndAdjudication(offence.disposalResults, isCarriedForwardOrReferredToCourtCase)
      : false
    offence.plea = !excludePleaAndAdjudication ? offence.plea : undefined
    offence.adjudication = !excludePleaAndAdjudication ? offence.adjudication : undefined
    offence.cjsOffenceCode = offence.cjsOffenceCode.slice(0, 7)

    offence.disposalResults?.forEach(
      (disposal) => (disposal.disposalQualifiers = disposal.disposalQualifiers?.map((dq) => dq.trim()))
    )
  })

  mockJson.additionalArrestOffences?.forEach((additionalArrestOffence) => {
    additionalArrestOffence.additionalOffences.forEach((offence) => {
      const excludePleaAndAdjudication = offence.disposalResults
        ? shouldExcludePleaAndAdjudication(offence.disposalResults, isCarriedForwardOrReferredToCourtCase)
        : false
      offence.plea = !excludePleaAndAdjudication ? offence.plea : undefined
      offence.adjudication = !excludePleaAndAdjudication ? offence.adjudication : undefined
    })
  })

  const addDisposalRequest = addDisposalRequestSchema.parse(mockJson)
  if (addDisposalRequest.referToCourtCase) {
    addDisposalRequest.referToCourtCase.reference = addDisposalRequest.referToCourtCase.reference.split("/")[1]
  }

  return addDisposalRequest
}

export default convertAddDisposalRequestMockJsonToLeds
