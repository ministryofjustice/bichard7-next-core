import type { AnnotatedHearingOutcome, Offence } from "types/AnnotatedHearingOutcome"
import constructOffenceReason from "phase1/lib/offence/constructOffenceReason"
import createCriminalProsecutionRef from "phase1/lib/offence/createCriminalProsecutionRef"
import getAreaCode from "phase1/lib/offence/getAreaCode"
import getOffenceCode from "phase1/lib/offence/getOffenceCode"
import isOffenceIgnored from "phase1/lib/offence/isOffenceIgnored"
import lookupOffenceCode from "phase1/lib/offence/lookupOffenceCode"
import type { EnrichAhoFunction } from "phase1/types/EnrichAhoFunction"
import enrichOffence from "phase1/enrichAho/enrichFunctions/enrichOffences/enrichOffence"
import handle100Offences from "phase1/enrichAho/enrichFunctions/enrichOffences/handle100Offences"
import parseAsn from "phase1/enrichAho/enrichFunctions/enrichOffences/parseAsn"

const enrichOffences: EnrichAhoFunction = (hearingOutcome: AnnotatedHearingOutcome) => {
  handle100Offences(hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case)

  const parsedAsn = parseAsn(
    hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  )

  const areaCode = getAreaCode(hearingOutcome)

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence: Offence) => {
    const offenceReason = offence.CriminalProsecutionReference.OffenceReason
    const offenceCode = getOffenceCode(offence)
    const offenceCodeLookup = lookupOffenceCode(offenceCode ?? "", offenceReason, areaCode)

    const parsedOffenceReason = offenceCode ? constructOffenceReason(offenceCode, areaCode, offenceReason) : undefined

    offence.CriminalProsecutionReference = {
      ...offence.CriminalProsecutionReference,
      ...createCriminalProsecutionRef(parsedAsn, parsedOffenceReason)
    }

    const offenceIgnored = isOffenceIgnored(offence)

    offence = enrichOffence(offence, offenceIgnored, offenceCodeLookup)
  })
  return hearingOutcome
}

export default enrichOffences
