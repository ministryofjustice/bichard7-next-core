import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { annotatedHearingOutcomeSchema } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ZodIssue } from "zod"
import exceptions from "src/exceptions"

const getExceptionCodeFromZod = (issue: ZodIssue): ExceptionCode => {
  if (issue.message in ExceptionCode) {
    return issue.message as ExceptionCode
  }

  return issue.message === "Required" ? ExceptionCode.HO100101 : ExceptionCode.HO100100
}

export default (aho: AnnotatedHearingOutcome): Exception[] => {
  let generatedExceptions: Exception[] = []

  const parseResults = annotatedHearingOutcomeSchema.safeParse(aho)

  if (!parseResults.success) {
    generatedExceptions = parseResults.error.issues.map((issue) => ({
      code: getExceptionCodeFromZod(issue),
      path: issue.path
    }))
  }

  generatedExceptions = Object.entries(exceptions)
    .reduce((acc: Exception[], [_, exception]) => {
      return acc.concat(exception(aho))
    }, [])
    .concat(generatedExceptions)

  return generatedExceptions
}
