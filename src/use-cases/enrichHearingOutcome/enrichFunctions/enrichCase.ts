import type { Case, Offence } from "src/types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
const HALF_LIFE_HOURS_URGENT_THRESHOLD = 48

const recordable = (offence: Offence) => {
  return offence.RecordableOnPNCindicator
}

const determineMostUrgentOffence = (ahoCase: Case) => {
  const minHalfLifeHours = Math.min(
    ahoCase.HearingDefendant.Offence.map((offence) => offence.ResultHalfLifeHours)
      .filter((x) => x)
      .push(Number.MAX_SAFE_INTEGER)
  )
  if (minHalfLifeHours < HALF_LIFE_HOURS_URGENT_THRESHOLD) {
    ahoCase.Urgent = {
      urgency: minHalfLifeHours,
      urgent: "Y"
    }
  }
}

const determineMostUrgentResult = (ahoCase: Case) => {
  const mostUrgentResult = Math.min(
    ahoCase.HearingDefendant.Offence.map((offence) => offence.Result.map((result) => result.Urgent?.urgency))
      .flat()
      .filter((x) => x)
      .push(Number.MAX_SAFE_INTEGER)
  )
  if (ahoCase.Urgent?.urgency && mostUrgentResult < ahoCase.Urgent?.urgency) {
    ahoCase.Urgent = {
      urgency: mostUrgentResult,
      urgent: "Y"
    }
  }
}

const enrichCase: EnrichAhoFunction = (hearingOutcome) => {
  const ahoCase = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case
  if (ahoCase) {
    ahoCase.RecordableOnPNCindicator = ahoCase.HearingDefendant?.Offence.some((offence) => recordable(offence))
    determineMostUrgentOffence(ahoCase)
    determineMostUrgentResult(ahoCase)
  }

  return hearingOutcome
}

export default enrichCase
