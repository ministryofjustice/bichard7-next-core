import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/core/lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = ""
  aho.Exceptions.push({
    code: ExceptionCode.HO100301,
    path: errorPaths.case.asn,
    message: "I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (11/01ZD/01/410832Q) NOT FOUND"
  })

  return aho
}
