import errorPaths from "@moj-bichard7-developers/bichard7-next-core/core/lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = ""
  aho.PncErrorMessage = "I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (11/01ZD/01/410832Q) NOT FOUND"
  aho.Exceptions.push({
    code: ExceptionCode.HO100301,
    path: errorPaths.case.asn
  })

  return aho
}
