import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

const generator: ExceptionGenerator = (_aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  const offences = _aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  offences.forEach((offence, offenceIndex) => {
    const results = offence.Result

    results.forEach((result, resultIndex) => {
      if (!result.PNCAdjudicationExists) {
        if (!offence.AddedByTheCourt) {
          const exception = {
            code: ExceptionCode.HO200106,
            path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
          }
          exceptions.push(exception)
        }
      }
    })
  })

  return exceptions
}

export default generator
