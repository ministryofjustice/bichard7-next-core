import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import errorPaths from "../../lib/exceptions/errorPaths"

const generator: ExceptionGenerator = (_aho: AnnotatedHearingOutcome, _options): Exception[] => {
  const offences = _aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  if (offences.length > 100) {
    return [{ code: ExceptionCode.HO200116, path: errorPaths.case.asn }]
  }

  return []
}

export default generator
