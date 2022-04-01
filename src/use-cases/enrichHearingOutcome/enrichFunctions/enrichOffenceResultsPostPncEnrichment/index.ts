import isCaseRecordable from "src/lib/isCaseRecordable"
import { SUSPENDED, SUSPENDED_2ND_DURATION_RESULTS } from "src/lib/properties"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
import populateCourt from "./populateCourt"
import populatePncDisposal from "./populatePncDisposal"
import populateResultClass from "./populateResultClass"

const enrichOffenceResultsPostPncEnrichment: EnrichAhoFunction = (hearingOutcome) => {
  const { DateOfHearing, CourtType } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence) => {
    offence.Result.forEach((result) => {
      result.ResultApplicableQualifierCode = []
      result.ResultHearingDate = offence.ConvictionDate ?? DateOfHearing
      if (
        result.CJSresultCode &&
        result.Duration &&
        result.Duration.length > 1 &&
        SUSPENDED_2ND_DURATION_RESULTS.includes(result.CJSresultCode)
      ) {
        result.Duration[1].DurationType = SUSPENDED
      }

      if (isCaseRecordable(hearingOutcome)) {
        populateResultClass(result, offence.ConvictionDate, DateOfHearing, CourtType)
        populatePncDisposal(hearingOutcome, result)
      }

      populateCourt(result, hearingOutcome)
    })
  })

  return hearingOutcome
}

export default enrichOffenceResultsPostPncEnrichment
