import type Exception from "src/types/Exception"
import type { ExceptionPath } from "src/types/Exception"

const findException = (
  exceptions: Exception[],
  generatedExceptions: Exception[],
  path: ExceptionPath,
  exceptionCode?: string
) => {
  const pathString = JSON.stringify(path)
  const condition = (exception: Exception) =>
    JSON.stringify(exception.path) === pathString && (!exceptionCode || exception.code === exceptionCode)
  return exceptions.find(condition) ?? generatedExceptions.find(condition)
}

export default findException
