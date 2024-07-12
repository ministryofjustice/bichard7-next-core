import addExceptionsToAho from "../../../../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../../../../phase1/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../../../types/AnnotatedHearingOutcome"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"

export const maxDisposalTextLength = 64

const validateDisposalText = (
  disposalText: string,
  aho: AnnotatedHearingOutcome,
  resultIndex: number,
  offenceIndex: number
) => {
  if (disposalText.length > maxDisposalTextLength) {
    addExceptionsToAho(
      aho,
      ExceptionCode.HO200200,
      errorPaths.offence(offenceIndex).result(resultIndex).resultVariableText
    )

    return `${disposalText.slice(0, maxDisposalTextLength - 1)}+`
  }

  return disposalText
}

export default validateDisposalText
