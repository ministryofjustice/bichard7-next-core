import { ResultClass } from "src/lib/properties"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"
import { offenceResultClassPath } from "src/use-cases/enrichHearingOutcome/enrichFunctions/enrichCourtCases/errorPaths"

const HO100326: ExceptionGenerator = (hearingOutcome) => {
  const generatedExceptions: Exception[] = []

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence, offenceIndex) => {
      if (!offence.AddedByTheCourt) {
        offence.Result.forEach((result, resultIndex) => {
          if (result.PNCAdjudicationExists === false && result.ResultClass === ResultClass.SENTENCE) {
            generatedExceptions.push({
              code: ExceptionCode.HO100326,
              path: offenceResultClassPath(offenceIndex, resultIndex)
            })
          }
        })
      }
    }
  )

  return generatedExceptions
}

export default HO100326
