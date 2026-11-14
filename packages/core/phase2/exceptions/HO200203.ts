import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import ExceptionCode from "@moj-bichard7/standing-data/types/ExceptionCode"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import addPaddingToBailCondition from "../../phase3/lib/addPaddingToBailCondition"

export const maxResultQualifierVariable = 4

const HO200203: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  const pncBailConditionLines: string[] = []

  const { BailConditions: bailConditions } = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  for (const [bailConditionIndex, bailCondition] of bailConditions.entries()) {
    const pncBailConditions = addPaddingToBailCondition(bailCondition)

    for (const pncBailCondition of pncBailConditions) {
      pncBailConditionLines.push(pncBailCondition)
      if (pncBailConditionLines.length > 20) {
        exceptions.push({ code: ExceptionCode.HO200203, path: errorPaths.bailConditions(bailConditionIndex) })
      }
    }
  }

  return exceptions
}

export default HO200203
