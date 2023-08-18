import type { AnnotatedHearingOutcome, Offence } from "core/common/types/AnnotatedHearingOutcome"
import constructOffenceReason from "../../../lib/offence/constructOffenceReason"
import createCriminalProsecutionRef from "../../../lib/offence/createCriminalProsecutionRef"
import getAreaCode from "../../../lib/offence/getAreaCode"
import getOffenceCode from "../../../lib/offence/getOffenceCode"
import isOffenceIgnored from "../../../lib/offence/isOffenceIgnored"
import lookupOffenceCode from "../../../lib/offence/lookupOffenceCode"
import type { EnrichAhoFunction } from "../../../types/EnrichAhoFunction"
import enrichOffence from "./enrichOffence"
import handle100Offences from "./handle100Offences"
import parseAsn from "./parseAsn"

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
