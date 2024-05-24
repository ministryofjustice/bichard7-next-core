import { lookupResultCodeByCjsCode } from "../../../dataLookup"
import type { EnrichAhoFunction } from "../../../types/EnrichAhoFunction"
import populateBailConditions from "./populateBailConditions"

const urgencyThresholdInHours = 48

const enrichOffenceResults: EnrichAhoFunction = (hearingOutcome) => {
  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  offences.forEach((offence) => {
    const results = offence.Result

    results.forEach((result) => {
      const resultCode = result.CJSresultCode

      if (resultCode) {
        const matchingResultCodeInConfigData = lookupResultCodeByCjsCode(resultCode.toString())

        if (matchingResultCodeInConfigData) {
          const halfLifeHours = matchingResultCodeInConfigData.resultHalfLifeHours

          if (halfLifeHours && halfLifeHours.length > 0) {
            result.ResultHalfLifeHours = parseInt(halfLifeHours, 10)

            if (result.ResultHalfLifeHours < urgencyThresholdInHours) {
              result.Urgent = { urgent: true, urgency: result.ResultHalfLifeHours }
            }
          }
        }
      }

      populateBailConditions(result)
    })
  })

  return hearingOutcome
}

export default enrichOffenceResults
