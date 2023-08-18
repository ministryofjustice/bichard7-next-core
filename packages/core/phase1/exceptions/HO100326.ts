import { ExceptionCode } from "types/ExceptionCode"
import errorPaths from "../lib/errorPaths"
import type Exception from "../types/Exception"
import type { ExceptionGenerator } from "../types/ExceptionGenerator"
import ResultClass from "../types/ResultClass"

const HO100326: ExceptionGenerator = (hearingOutcome) => {
  const generatedExceptions: Exception[] = []

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence, offenceIndex) => {
      if (!offence.AddedByTheCourt) {
        offence.Result.forEach((result, resultIndex) => {
          if (result.PNCAdjudicationExists === false && result.ResultClass === ResultClass.SENTENCE) {
            generatedExceptions.push({
              code: ExceptionCode.HO100326,
              path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
            })
          }
        })
      }
    }
  )

  return generatedExceptions
}

export default HO100326
