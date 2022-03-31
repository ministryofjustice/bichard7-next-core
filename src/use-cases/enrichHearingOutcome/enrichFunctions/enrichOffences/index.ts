import parseASN from "src/lib/parseASN"
import parseOffenceReason from "src/lib/parseOffenceReason"
import type { AnnotatedHearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
import createCriminalProsecutionRef from "src/utils/offence/createCriminalProsecutionRef"
import getAreaCode from "src/utils/offence/getAreaCode"
import getOffenceCode from "src/utils/offence/getOffenceCode"
import enrichOffence from "./enrichOffence"

const enrichOffences: EnrichAhoFunction = (hearingOutCome: AnnotatedHearingOutcome) => {
  const parsedASN = parseASN(
    hearingOutCome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  )

  const areaCode = getAreaCode(hearingOutCome)

  hearingOutCome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence: Offence) => {
    const offenceCode = offence.CriminalProsecutionReference.OffenceReason
      ? getOffenceCode(offence.CriminalProsecutionReference.OffenceReason)
      : undefined
    const parsedOffenceReason = offenceCode ? parseOffenceReason(offenceCode, areaCode) : undefined

    offence.CriminalProsecutionReference = {
      ...offence.CriminalProsecutionReference,
      ...createCriminalProsecutionRef(parsedASN, parsedOffenceReason)
    }

    offence = enrichOffence(offence)
  })
  return hearingOutCome
}

export default enrichOffences
