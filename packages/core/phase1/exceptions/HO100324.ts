import { ExceptionCode } from "types/ExceptionCode"
import errorPaths from "phase1/lib/errorPaths"
import type Exception from "phase1/types/Exception"
import type { ExceptionGenerator } from "phase1/types/ExceptionGenerator"
import ResultClass from "phase1/types/ResultClass"

const HO100324: ExceptionGenerator = (hearingOutcome) => {
  const generatedExceptions: Exception[] = []

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence, offenceIndex) => {
      if (!offence.AddedByTheCourt) {
        offence.Result.forEach((result, resultIndex) => {
          if (result.PNCAdjudicationExists === true && result.ResultClass === ResultClass.ADJOURNMENT_PRE_JUDGEMENT) {
            generatedExceptions.push({
              code: ExceptionCode.HO100324,
              path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
            })
          }
        })
      }
    }
  )

  return generatedExceptions
}

export default HO100324
