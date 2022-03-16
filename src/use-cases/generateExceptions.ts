import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import { annotatedHearingOutcomeSchema } from "../types/AnnotatedHearingOutcome"
import type Exception from "../types/Exception"
import { ExceptionCode } from "../types/ExceptionCode"
import type { ZodIssue } from "zod"

const getExceptionCodeFromZod = (issue: ZodIssue): ExceptionCode => {
  if (issue.message in ExceptionCode) {
    return issue.message as ExceptionCode
  }

  return issue.message === "Required" ? ExceptionCode.HO100101 : ExceptionCode.HO100100
}

export default (aho: AnnotatedHearingOutcome): Exception[] => {
  const parseResults = annotatedHearingOutcomeSchema.safeParse(aho)

  if (!parseResults.success) {
    return parseResults.error.issues.map((issue) => ({
      code: getExceptionCodeFromZod(issue),
      path: issue.path
    }))
  }

  return []
}
