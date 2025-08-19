import type Exception from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import nonRecordableResultCodes from "@moj-bichard7/common/aho/offences/nonRecordableResultCodes"
import ResultClass from "@moj-bichard7/common/types/ResultClass"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import isCaseRecordable from "../../lib/isCaseRecordable"
import isNotGuiltyVerdict from "../enrichAho/enrichFunctions/enrichOffenceResultsPostPncEnrichment/isNotGuiltyVerdict"
import isResultClassCode from "../enrichAho/enrichFunctions/enrichOffenceResultsPostPncEnrichment/isResultClassCode"

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
        (offence.AddedByTheCourt === undefined && !nonRecordableResultCodes.includes(CJSresultCode))
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
