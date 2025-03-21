import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { ComparisonData, ComparisonOutput } from "../../types/ComparisonData"

import { maxDisposalTextLength } from "../../../lib/results/createPncDisposalsFromResult/createPncDisposalByFirstAndSecondDurations"
import licencedPremisesExclusionOrderDisposalText from "../../../lib/results/getDisposalTextFromResult/licencedPremisesExclusionOrderDisposalText"
import { checkIntentionalDifferenceForPhases } from "./index"

// Previously Bichard would not raise a HO200200 exception when ResultVariableText
// was multiline and length exceeded the limit. We improved the regular expression
// in Core to support all whitespace characters including new line characters.

const bichardRegex = /DEFENDANT EXCLUDED FROM(?<location>.*)FOR A PERIOD OF/g

const hasException200200 = (comparisonData: ComparisonOutput, offenceIndex: number, resultIndex: number) =>
  comparisonData.aho.Exceptions.some(
    (exception) =>
      exception.path[5] === offenceIndex &&
      exception.path[7] === resultIndex &&
      exception.code === ExceptionCode.HO200200
  )

const hasCoreResultRaisedHo200200DueToImprovedRegEx = (
  actual: ComparisonOutput,
  expected: ComparisonOutput,
  offenceIndex: number,
  resultIndex: number
) => {
  const resultVariableText =
    actual.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
      resultIndex
    ].ResultVariableText?.toUpperCase()

  if (
    !resultVariableText ||
    !hasException200200(actual, offenceIndex, resultIndex) ||
    hasException200200(expected, offenceIndex, resultIndex)
  ) {
    return false
  }

  const coreDisposalText = licencedPremisesExclusionOrderDisposalText(resultVariableText)
  const bichardDisposalText = bichardRegex.exec(resultVariableText)?.groups?.location

  return !bichardDisposalText && coreDisposalText.length > maxDisposalTextLength
}

const ho200200AndMultilineResultVariableText = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([2], phase, (): boolean => {
    const actualOffences = actual.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
    const coreRaisesHo200200DueToImprovedRegex = actualOffences.some((offence, offenceIndex) =>
      offence.Result.some((_, resultIndex) =>
        hasCoreResultRaisedHo200200DueToImprovedRegEx(actual, expected, offenceIndex, resultIndex)
      )
    )

    return coreRaisesHo200200DueToImprovedRegex
  })

export default ho200200AndMultilineResultVariableText
