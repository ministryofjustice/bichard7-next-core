import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import addPaddingToBailCondition from "../../phase3/lib/addPaddingToBailCondition"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

export const maxResultQualifierVariable = 4

const HO200203: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  const pncBailConditionLines: string[] = []

  const {BailConditions: bailConditions} = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  for (const [
    bailConditionIndex,
    bailCondition
  ] of bailConditions.entries()) {
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
