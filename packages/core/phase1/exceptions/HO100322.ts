import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"
import isCaseRecordable from "../../lib/isCaseRecordable"
import isAdjourned from "../lib/result/isAdjourned"

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
