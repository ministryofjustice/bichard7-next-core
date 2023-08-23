import { ExceptionCode } from "types/ExceptionCode"
import errorPaths from "phase1/lib/errorPaths"
import isCaseRecordable from "phase1/lib/isCaseRecordable"
import isAdjourned from "phase1/lib/result/isAdjourned"
import type Exception from "phase1/types/Exception"
import type { ExceptionGenerator } from "phase1/types/ExceptionGenerator"

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
