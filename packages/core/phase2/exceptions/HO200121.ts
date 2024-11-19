import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import isRecordableOffence from "../lib/isRecordableOffence"

const HO200121: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  if (offences.filter(isRecordableOffence).length === 0) {
    exceptions.push({
      code: ExceptionCode.HO200121,
      path: errorPaths.case.asn
    })
  }

  return exceptions
}

export default HO200121
