import isCaseRecordable from "src/lib/isCaseRecordable"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
import populateCourt from "./populateCourt"
import populatePncDisposal from "./populatePncDisposal"
import populateResultClass from "./populateResultClass"

const suspendedSecondDurationResults = [1115, 1134]
const suspended = "Suspended"

const enrichOffenceResultsPostPncEnrichment: EnrichAhoFunction = (hearingOutcome) => {
  const { DateOfHearing } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence) => {
    offence.Result.forEach((result) => {
      result.ResultApplicableQualifierCode = []
      result.ResultHearingDate = offence.ConvictionDate ?? DateOfHearing
      if (
        result.CJSresultCode &&
        result.Duration &&
        result.Duration.length > 1 &&
        suspendedSecondDurationResults.includes(result.CJSresultCode)
      ) {
        result.Duration[1].DurationType = suspended
      }

      if (isCaseRecordable(hearingOutcome)) {
        populateResultClass(result, offence.ConvictionDate, DateOfHearing)
        populatePncDisposal(hearingOutcome, result)
      }

      populateCourt(result, hearingOutcome)
    })
  })

  return hearingOutcome
}

export default enrichOffenceResultsPostPncEnrichment
