import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import errorPaths from "../../lib/exceptions/errorPaths"

const MAX_ALLOWABLE_OFFENCES = 100

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  if (offences.length > MAX_ALLOWABLE_OFFENCES) {
    return [{ code: ExceptionCode.HO200116, path: errorPaths.case.asn }]
  }

  return []
}

export default generator
