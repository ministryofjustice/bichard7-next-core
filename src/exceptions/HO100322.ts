import isAdjourned from "src/lib/isAdjourned"
import isCaseRecordable from "src/lib/isCaseRecordable"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"
import { nextResultSourceOrganisationPath } from "src/use-cases/enrichHearingOutcome/enrichFunctions/enrichOffenceResultsPostPncEnrichment/errorPaths"

const HO100322: ExceptionGenerator = (hearingOutcome) => {
  if (!isCaseRecordable(hearingOutcome)) {
    return []
  }

  const generatedExceptions: Exception[] = []
  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence, offenceIndex) => {
      offence.Result.forEach((result, resultIndex) => {
        if (isAdjourned(result.CJSresultCode) && !result.NextResultSourceOrganisation) {
          const path = nextResultSourceOrganisationPath(offenceIndex, resultIndex)
          generatedExceptions.push({ code: ExceptionCode.HO100322, path })
        }
      })
    }
  )

  return generatedExceptions
}

export default HO100322
