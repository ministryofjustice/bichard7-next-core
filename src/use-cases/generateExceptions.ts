import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { annotatedHearingOutcomeSchema } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ZodIssue } from "zod"

const getExceptionCodeFromZod = (issue: ZodIssue): ExceptionCode => {
  if (issue.message in ExceptionCode) {
    return issue.message as ExceptionCode
  }

  return issue.message === "Required" ? ExceptionCode.HO100101 : ExceptionCode.HO100100
}

export default (aho: AnnotatedHearingOutcome): Exception[] => {
  const parseResults = annotatedHearingOutcomeSchema.safeParse(aho)

  console.log(JSON.stringify(parseResults, null, 2))

  if (!parseResults.success) {
    return parseResults.error.issues.map((issue) => ({
      code: getExceptionCodeFromZod(issue),
      path: issue.path
    }))
  }

  return []
}
