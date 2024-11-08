import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

const MAX_ALLOWABLE_OFFENCES = 100

const HO200116: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  if (offences.length > MAX_ALLOWABLE_OFFENCES) {
    return [{ code: ExceptionCode.HO200116, path: errorPaths.case.asn }]
  }

  return []
}

export default HO200116
