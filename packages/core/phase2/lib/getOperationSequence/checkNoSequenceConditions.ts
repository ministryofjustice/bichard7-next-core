import addExceptionsToAho from "../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../phase1/lib/errorPaths"
import isDummyAsn from "../../../phase1/lib/isDummyAsn"
import type { AnnotatedHearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../../types/ExceptionCode"
import isRecordableResult from "../isRecordableResult"

const getErrorPath = (offence: Offence, offenceIndex: number) =>
  offence.CriminalProsecutionReference?.OffenceReason?.__type === "NationalOffenceReason"
    ? errorPaths.offence(offenceIndex).offenceReason.offenceCodeReason
    : errorPaths.offence(offenceIndex).offenceReason.localOffenceCode

const checkNoSequenceConditions = (aho: AnnotatedHearingOutcome) => {
  const asn = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  if (aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator && isDummyAsn(asn)) {
    addExceptionsToAho(aho, ExceptionCode.HO200110, errorPaths.case.asn)
  }

  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  if (offences.length > 100) {
    addExceptionsToAho(aho, ExceptionCode.HO200116, errorPaths.case.asn)
    return
  }

  offences.forEach((offence, offenceIndex) => {
    if (offence.Result.filter(isRecordableResult).length > 10) {
      addExceptionsToAho(aho, ExceptionCode.HO200117, getErrorPath(offence, offenceIndex))
    }
  })
}

export default checkNoSequenceConditions
