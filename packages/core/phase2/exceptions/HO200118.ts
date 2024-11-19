import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import isRecordableOffence from "../lib/isRecordableOffence"
import isRecordableResult from "../lib/isRecordableResult"

const doRecordableOffencesHaveNonRecordableResults = (aho: AnnotatedHearingOutcome) => {
  const recordableOffences =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(isRecordableOffence)

  return (
    recordableOffences.length > 0 &&
    recordableOffences.every((offence) => offence.Result.every((result) => !isRecordableResult(result)))
  )
}

const HO200118: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  doRecordableOffencesHaveNonRecordableResults(aho) ? [{ code: ExceptionCode.HO200118, path: errorPaths.case.asn }] : []

export default HO200118
