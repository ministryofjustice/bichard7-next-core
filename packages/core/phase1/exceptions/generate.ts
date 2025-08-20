import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"
import type { ZodIssue } from "zod"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import { validatedHearingOutcomeSchema } from "../../schemas/validatedHearingOutcome"
import * as exceptions from "../exceptions/exceptions"

const getExceptionCodeFromZod = (issue: ZodIssue): ExceptionCode => {
  if (issue.message in ExceptionCode) {
    return issue.message as ExceptionCode
  }

  return issue.message === "Required" ? ExceptionCode.HO100101 : ExceptionCode.HO100100
}

export default (aho: AnnotatedHearingOutcome): Exception[] => {
  let generatedExceptions: Exception[] = []

  const parseResults = validatedHearingOutcomeSchema.safeParse(aho)

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

  return generatedExceptions.concat(ho100300, ho100323).sort((a, b) => a.code.localeCompare(b.code))
}
