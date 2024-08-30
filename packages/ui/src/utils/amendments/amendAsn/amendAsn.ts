import convertAsnToLongFormat from "@moj-bichard7-developers/bichard7-next-core/core/phase1/enrichAho/enrichFunctions/enrichDefendant/convertAsnToLongFormat"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Amendments } from "types/Amendments"
import isAsnFormatValid from "utils/exceptions/isAsnFormatValid"

const amendAsn = (newAsn: Amendments["asn"], aho: AnnotatedHearingOutcome): boolean => {
  if (!newAsn) {
    return false
  }

  const fullAsn = convertAsnToLongFormat(newAsn)
  if (!isAsnFormatValid(fullAsn)) {
    console.error("ASN not valid; not updating")
    return false
  }

  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = fullAsn
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence) => {
    if (offence.CriminalProsecutionReference.DefendantOrOffender) {
      offence.CriminalProsecutionReference.DefendantOrOffender.DefendantOrOffenderSequenceNumber =
        fullAsn.length === 21 ? fullAsn.substring(9, 20) : fullAsn.substring(8, 19)
    }
  })

  return true
}

export default amendAsn
