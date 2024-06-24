import { ExceptionCode } from "../../../types/ExceptionCode"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

const ho100310AndHo100332Equivalent = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    if (actual.aho.Exceptions.length === 0) {
      return false
    }

    const bichardExceptions = expected.aho.Exceptions.filter(
      (e) => e.code === ExceptionCode.HO100310 || e.code === ExceptionCode.HO100332
    )

    const coreExceptions = actual.aho.Exceptions.filter(
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
  })

export default ho100310AndHo100332Equivalent
