import { ExceptionCode } from "core/common/types/ExceptionCode"
import errorPaths from "../lib/errorPaths"
import type Exception from "../types/Exception"
import type { ExceptionGenerator } from "../types/ExceptionGenerator"
import ResultClass from "../types/ResultClass"

const HO100325: ExceptionGenerator = (hearingOutcome) => {
  const generatedExceptions: Exception[] = []

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence, offenceIndex) => {
      if (!offence.AddedByTheCourt) {
        offence.Result.forEach((result, resultIndex) => {
          if (result.PNCAdjudicationExists === false && result.ResultClass === ResultClass.ADJOURNMENT_POST_JUDGEMENT) {
            generatedExceptions.push({
              code: ExceptionCode.HO100325,
              path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
            })
          }
        })
      }
    }
  )

  return generatedExceptions
}

export default HO100325
