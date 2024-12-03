import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import { createPncDisposalsFromResult } from "../../phase2/lib/createPncDisposalsFromResult"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"

const HO200200 = (hearingOutcome: AnnotatedHearingOutcome): Exception[] => {
  return hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
    (acc: Exception[], offence, offenceIndex) => {
      for (const [resultIndex, result] of offence.Result.entries()) {
        const disposals = createPncDisposalsFromResult(result)

        for (const disposal of disposals) {
          if (disposal.truncatedText) {
            acc.push({
              code: ExceptionCode.HO200200,
              path: errorPaths.offence(offenceIndex).result(resultIndex).resultVariableText
            })
          }
        }
      }

      return acc
    },
    []
  )
}

export default HO200200
