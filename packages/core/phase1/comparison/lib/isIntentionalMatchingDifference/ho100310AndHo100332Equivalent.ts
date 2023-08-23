import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import { ExceptionCode } from "types/ExceptionCode"
import type { CourtResultMatchingSummary } from "phase1/comparison/types/MatchingComparisonOutput"

const ho100310AndHo100332Equivalent = (
  _: CourtResultMatchingSummary,
  __: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome
): boolean => {
  if (actualAho.Exceptions.length === 0) {
    return false
  }

  const bichardExceptions = expectedAho.Exceptions.filter(
    (e) => e.code === ExceptionCode.HO100310 || e.code === ExceptionCode.HO100332
  )

  const coreExceptions = actualAho.Exceptions.filter(
    (e) => e.code === ExceptionCode.HO100310 || e.code === ExceptionCode.HO100332
  )

  if (
    coreExceptions.length !== bichardExceptions.length ||
    bichardExceptions.length === 0 ||
    coreExceptions.length === 0
  ) {
    return false
  }

  const coreExceptionTypes = coreExceptions.map((e) => e.code).sort()
  const bichardExceptionTypes = bichardExceptions.map((e) => e.code).sort()
  const exceptionTypesMatch = JSON.stringify(coreExceptionTypes) === JSON.stringify(bichardExceptionTypes)

  if (exceptionTypesMatch) {
    return false
  }

  const coreExceptionPaths = coreExceptions.map((e) => e.path)
  const bichardExceptionPaths = coreExceptions.map((e) => e.path)
  const exceptionPathsMatch = JSON.stringify(coreExceptionPaths) === JSON.stringify(bichardExceptionPaths)

  return exceptionPathsMatch
}

export default ho100310AndHo100332Equivalent
