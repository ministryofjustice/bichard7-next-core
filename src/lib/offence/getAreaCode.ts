import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

export default (hearingOutCome: AnnotatedHearingOutcome): string => {
  const asn = hearingOutCome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  const offset = asn.length === 21 ? 1 : 0

  return (
    hearingOutCome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.SecondLevelCode ||
    hearingOutCome.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN.substring(0, 2) ||
    asn.substring(2 + offset, 4 + offset)
  )
}
