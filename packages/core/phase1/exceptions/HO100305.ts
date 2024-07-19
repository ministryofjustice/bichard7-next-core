import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import isCaseRecordable from "../../lib/isCaseRecordable"
import resultCodeIsOnStopList from "../../lib/resultCodeIsOnStopList"
import type Exception from "../../types/Exception"
import ResultClass from "../../types/ResultClass"
import isNotGuiltyVerdict from "../enrichAho/enrichFunctions/enrichOffenceResultsPostPncEnrichment/isNotGuiltyVerdict"
import isResultClassCode from "../enrichAho/enrichFunctions/enrichOffenceResultsPostPncEnrichment/isResultClassCode"
import type { ExceptionGenerator } from "../types/ExceptionGenerator"

const HO100305: ExceptionGenerator = (hearingOutcome) => {
  const generatedExceptions: Exception[] = []

  if (!isCaseRecordable(hearingOutcome)) {
    return generatedExceptions
  }

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence, offenceIndex) =>
    offence.Result.forEach((result, resultIndex) => {
      if (result.ResultClass !== ResultClass.UNRESULTED) {
        return
      }

      const { Verdict, CJSresultCode } = result
      if (
        isResultClassCode(CJSresultCode) ||
        isNotGuiltyVerdict(Verdict) ||
        (offence.AddedByTheCourt === undefined && !resultCodeIsOnStopList(CJSresultCode))
      ) {
        generatedExceptions.push({
          code: ExceptionCode.HO100305,
          path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
        })
      }
    })
  )

  return generatedExceptions
}

export default HO100305
