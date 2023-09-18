import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"

const generateExceptionLogAttributes = (hearingOutcome: AnnotatedHearingOutcome): Record<string, unknown> => ({
  "Exception Type": hearingOutcome.Exceptions[0].code,
  "Number Of Errors": hearingOutcome.Exceptions.length,
  ...hearingOutcome.Exceptions.reduce((acc: Record<string, unknown>, exception, i) => {
    acc[`Error ${i + 1} Details`] = exception.code + "||" + exception.path.slice(-1)

    return acc
  }, {})
})

export default generateExceptionLogAttributes
