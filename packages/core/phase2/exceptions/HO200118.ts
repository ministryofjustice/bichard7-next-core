import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import errorPaths from "../../lib/exceptions/errorPaths"
import isRecordableOffence from "../lib/isRecordableOffence"
import isRecordableResult from "../lib/isRecordableResult"

const doRecordableOffencesHaveNonRecordableResults = (aho: AnnotatedHearingOutcome) =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (offence) => isRecordableOffence(offence) && offence.Result.every((result) => !isRecordableResult(result))
  )

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  doRecordableOffencesHaveNonRecordableResults(aho) ? [{ code: ExceptionCode.HO200118, path: errorPaths.case.asn }] : []

export default generator
