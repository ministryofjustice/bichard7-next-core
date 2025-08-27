import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"
import type { ZodError } from "zod"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import { validatedHearingOutcomeSchema } from "../../schemas/validatedHearingOutcome"
import * as exceptions from "../exceptions/exceptions"

const getExceptionsFromZod = (error: ZodError): Exception[] => {
  return error.issues.map((issue) => {
    const path = issue.path.filter((p) => typeof p === "string" || typeof p === "number")
    if (issue.message in ExceptionCode) {
      return {
        code: issue.message as ExceptionCode,
        path
      }
    }

    if (issue.code === "invalid_type") {
      if (issue.message.includes("undefined")) {
        return {
          code: ExceptionCode.HO100101,
          path
        }
      }
    }

    return {
      code: ExceptionCode.HO100100,
      path
    }
  })
}

export default (aho: AnnotatedHearingOutcome): Exception[] => {
  let generatedExceptions: Exception[] = []

  const parseResults = validatedHearingOutcomeSchema.safeParse(aho)

  if (!parseResults.success) {
    generatedExceptions = getExceptionsFromZod(parseResults.error)
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
