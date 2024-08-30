import errorPaths from "@moj-bichard7-developers/bichard7-next-core/core/lib/exceptions/errorPaths"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = true
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = "0800NP0138062471055A"

  aho.Exceptions.push({
    code: ExceptionCode.HO100321,
    path: errorPaths.case.asn
  })

  return aho
}
