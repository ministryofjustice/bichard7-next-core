import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import recordableResultCount from "./recordableResultCount"
import errorPaths from "../phase1/lib/errorPaths"
import { ExceptionCode } from "../types/ExceptionCode"
import addExceptionsToAho from "../phase1/exceptions/addExceptionsToAho"
import isDummyAsn from "../phase1/lib/isDummyAsn"

const checkNoSequenceConditions = (aho: AnnotatedHearingOutcome) => {
  const asn = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  if (aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator && isDummyAsn(asn)) {
    addExceptionsToAho(aho, ExceptionCode.HO200110, errorPaths.case.asn)
  }
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  if (offences.length > 100) {
    addExceptionsToAho(aho, ExceptionCode.HO200116, errorPaths.case.asn)
  } else {
    offences.forEach((offence, offenceIndex) => {
      const count = recordableResultCount(offence.Result)

      if (count > 10) {
        const errorPath =
          offence.CriminalProsecutionReference?.OffenceReason?.__type === "NationalOffenceReason"
            ? errorPaths.offence(offenceIndex).offenceReason.offenceCodeReason
            : errorPaths.offence(offenceIndex).offenceReason.localOffenceCode
        addExceptionsToAho(aho, ExceptionCode.HO200117, errorPath)
      }
    })
  }
}

export default checkNoSequenceConditions
