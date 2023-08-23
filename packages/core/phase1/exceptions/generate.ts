import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import { ExceptionCode } from "types/ExceptionCode"
import type { ZodIssue } from "zod"
import { annotatedHearingOutcomeSchema } from "phase1/schemas/annotatedHearingOutcome"
import type Exception from "phase1/types/Exception"
import * as exceptions from "phase1/exceptions/exceptions"
import pncExceptions from "phase1/exceptions/pncExceptions"

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
    .filter(([exceptionCode]) => exceptionCode != ExceptionCode.HO100300)
    .reduce((acc: Exception[], [_, exception]) => {
      return acc.concat(exception(aho))
    }, [])
    .concat(generatedExceptions)

  // Generate HO100300 which depends on other exceptions generated
  const ho100300 = exceptions.HO100300(aho, { exceptions: generatedExceptions })

  // Generate HO100323 which depends on HO100322
  const ho100323 = exceptions.HO100323(aho, { exceptions: generatedExceptions })

  const pncGeneratedExceptions = pncExceptions(aho)

  return generatedExceptions
    .concat(ho100300, ho100323, pncGeneratedExceptions)
    .sort((a, b) => a.code.localeCompare(b.code))
}
