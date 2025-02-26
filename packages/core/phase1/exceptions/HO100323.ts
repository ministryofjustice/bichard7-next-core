import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"
import isCaseRecordable from "../../lib/isCaseRecordable"
import findException from "../lib/findException"

const hasHO100322 = (exceptions: Exception[], offenceIndex: number, resultIndex: number): boolean =>
  !!findException(
    exceptions,
    [],
    errorPaths.offence(offenceIndex).result(resultIndex).nextResultSourceOrganisation.organisationUnitCode,
    ExceptionCode.HO100322
  )

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
          const path = errorPaths.offence(offenceIndex).result(resultIndex).nextHearingDate
          result.NextHearingDate = null
          generatedExceptions.push({ code: ExceptionCode.HO100323, path })
        }
      })
    }
  )

  return generatedExceptions
}

export default HO100323
