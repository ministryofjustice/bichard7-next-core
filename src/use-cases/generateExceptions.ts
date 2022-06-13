import exceptions from "src/exceptions"
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

  // Exception HO100321 should only added when recordable
  if (!aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator) {
    generatedExceptions = generatedExceptions.filter((e) => e.code != ExceptionCode.HO100321)
  }

  return generatedExceptions.concat(ho100300)
}
