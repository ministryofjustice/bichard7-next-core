import { ExceptionCode } from "types/ExceptionCode"
import isNotGuiltyVerdict from "phase1/enrichAho/enrichFunctions/enrichOffenceResultsPostPncEnrichment/isNotGuiltyVerdict"
import isResultClassCode from "phase1/enrichAho/enrichFunctions/enrichOffenceResultsPostPncEnrichment/isResultClassCode"
import errorPaths from "phase1/lib/errorPaths"
import isCaseRecordable from "phase1/lib/isCaseRecordable"
import resultCodeIsOnStopList from "phase1/lib/result/resultCodeIsOnStopList"
import type Exception from "phase1/types/Exception"
import type { ExceptionGenerator } from "phase1/types/ExceptionGenerator"
import ResultClass from "phase1/types/ResultClass"

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
