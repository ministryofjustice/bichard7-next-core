import errorPaths from "src/lib/errorPaths"
import { ResultClass } from "src/lib/properties"
import resultCodeIsOnStopList from "src/lib/resultCodeIsOnStopList"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"

const HO100305: ExceptionGenerator = (hearingOutcome) => {
  const generatedExceptions: Exception[] = []

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence, offenceIndex) =>
    offence.Result.forEach((result, resultIndex) => {
      if (
        result.ResultClass === ResultClass.UNRESULTED &&
        offence.AddedByTheCourt === undefined &&
        !resultCodeIsOnStopList(result.CJSresultCode)
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
