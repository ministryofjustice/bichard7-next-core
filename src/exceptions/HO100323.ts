import findException from "src/lib/findException"
import isCaseRecordable from "src/lib/isCaseRecordable"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"
import { nextResultSourceOrganisationPath } from "src/use-cases/enrichHearingOutcome/enrichFunctions/enrichOffenceResultsPostPncEnrichment/errorPaths"
import { nextHearingDatePath } from "src/use-cases/transformSpiToAho/errorPaths"

const hasHO100322 = (exceptions: Exception[], offenceIndex: number, resultIndex: number): boolean =>
  !!findException(exceptions, [], nextResultSourceOrganisationPath(offenceIndex, resultIndex), ExceptionCode.HO100322)

const HO100323: ExceptionGenerator = (hearingOutcome, options) => {
  if (!isCaseRecordable(hearingOutcome)) {
    return []
  }

  const exceptions: Exception[] = options?.exceptions ?? []
  const generatedExceptions: Exception[] = []

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence, offenceIndex) => {
      offence.Result.forEach((result, resultIndex) => {
        if (hasHO100322(exceptions, offenceIndex, resultIndex) && !result.NextHearingDate) {
          const path = nextHearingDatePath(offenceIndex, resultIndex)
          generatedExceptions.push({ code: ExceptionCode.HO100323, path })
        }
      })
    }
  )

  return generatedExceptions
}

export default HO100323
