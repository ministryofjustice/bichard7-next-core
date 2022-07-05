import errorPaths from "src/lib/errorPaths"
import isCaseRecordable from "src/lib/isCaseRecordable"
import isAdjourned from "src/lib/result/isAdjourned"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"

const HO100322: ExceptionGenerator = (hearingOutcome) => {
  if (!isCaseRecordable(hearingOutcome)) {
    return []
  }

  const generatedExceptions: Exception[] = []
  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence, offenceIndex) => {
      offence.Result.forEach((result, resultIndex) => {
        if (isAdjourned(result.CJSresultCode) && !result.NextResultSourceOrganisation) {
          const path = errorPaths.offence(offenceIndex).result(resultIndex)
            .nextResultSourceOrganisation.organisationUnitCode
          generatedExceptions.push({ code: ExceptionCode.HO100322, path })
          result.NextResultSourceOrganisation = null
        }
      })
    }
  )

  return generatedExceptions
}

export default HO100322
