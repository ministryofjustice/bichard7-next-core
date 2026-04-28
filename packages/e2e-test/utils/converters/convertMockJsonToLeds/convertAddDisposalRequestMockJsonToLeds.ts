import { addDisposalRequestSchema } from "@moj-bichard7/core/schemas/leds/addDisposalRequest"
import type { AddDisposalRequest, ArrestOffence } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { Offence } from "@moj-bichard7/core/types/leds/DisposalRequest"

const isAddedForPncXmlConversion = (result: string | undefined): boolean => result === result?.toUpperCase()

const convertAddDisposalRequestMockJsonToLeds = (mockJson: object): AddDisposalRequest => {
  if ("offences" in mockJson && Array.isArray(mockJson.offences)) {
    mockJson.offences.forEach((offence: Offence) => {
      offence.cjsOffenceCode = offence.cjsOffenceCode.slice(0, 7)
      offence.plea = isAddedForPncXmlConversion(offence.plea) ? undefined : offence.plea
      offence.adjudication = isAddedForPncXmlConversion(offence.adjudication) ? undefined : offence.adjudication

      if ("disposalResults" in offence && Array.isArray(offence.disposalResults)) {
        offence.disposalResults.forEach((disposal) => {
          disposal.disposalQualifiers = disposal.disposalQualifiers?.map((dq) => dq.trim())
        })
      }
    })
  }

  if ("additionalArrestOffences" in mockJson && Array.isArray(mockJson.additionalArrestOffences)) {
    mockJson.additionalArrestOffences.forEach((additionalArrestOffence) => {
      if (Array.isArray(additionalArrestOffence.additionalOffences)) {
        additionalArrestOffence.additionalOffences.forEach((offence: ArrestOffence) => {
          offence.plea = isAddedForPncXmlConversion(offence.plea) ? undefined : offence.plea
          offence.adjudication = isAddedForPncXmlConversion(offence.adjudication) ? undefined : offence.adjudication
        })
      }
    })
  }

  return addDisposalRequestSchema.parse(mockJson)
}

export default convertAddDisposalRequestMockJsonToLeds
