import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
const HALF_LIFE_HOURS_URGENT_THRESHOLD = 48

const recordable = (offence: Offence) => {
  return offence.RecordableOnPNCindicator
}

const enrichCase: EnrichAhoFunction = (hearingOutcome) => {
  const ahoCase = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case
  if (ahoCase) {
    ahoCase.RecordableOnPNCindicator = ahoCase.HearingDefendant?.Offence.some((offence) => recordable(offence))

    const mostUrgentResult = Math.min(
      ...ahoCase.HearingDefendant.Offence.map((offence) =>
        offence.Result.map((result) => result.Urgent?.urgency ?? Number.MAX_SAFE_INTEGER)
      ).flat()
    )

    if (mostUrgentResult < HALF_LIFE_HOURS_URGENT_THRESHOLD) {
      ahoCase.Urgent = {
        urgency: mostUrgentResult,
        urgent: true
      }
    }

    if (ahoCase.CourtReference?.MagistratesCourtReference?.toUpperCase() === "Truncated".toUpperCase()) {
      if (ahoCase.PTIURN) {
        ahoCase.CourtReference.MagistratesCourtReference = ahoCase.PTIURN
      }
    }
  }

  return hearingOutcome
}

export default enrichCase
