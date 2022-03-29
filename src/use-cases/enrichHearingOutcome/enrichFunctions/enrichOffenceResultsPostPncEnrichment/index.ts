import { SUSPENDED, SUSPENDED_2ND_DURATION_RESULTS } from "../../../../lib/properties"
import type { EnrichAhoFunction } from "../../../../types/EnrichAhoFunction"
import isCaseRecordable from "../../../../lib/isCaseRecordable"
import populateCourt from "./populateCourt"
import populateResultClass from "./populateResultClass"
import populatePncDisposal from "./populatePncDisposal"

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

      populateCourt(result, hearingOutcome)

      if (isCaseRecordable(hearingOutcome)) {
        populateResultClass(result, offence.ConvictionDate, DateOfHearing, CourtType, !!offence.AddedByTheCourt)
        populatePncDisposal(hearingOutcome, result)
      }
    })
  })

  return hearingOutcome
}

export default enrichOffenceResultsPostPncEnrichment
