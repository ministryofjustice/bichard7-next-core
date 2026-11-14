import type Exception from "@moj-bichard7/common/types/Exception"

import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import ResultClass from "@moj-bichard7/common/types/ResultClass"
import ExceptionCode from "@moj-bichard7/standing-data/types/ExceptionCode"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

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
