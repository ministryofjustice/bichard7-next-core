import type { Exception } from "types/exceptions"
import offenceMatchingExceptions from "./offenceMatchingExceptions"

const getOffenceMatchingExceptions = (exceptions: Exception[]): Exception[] =>
  exceptions.filter((exception) => offenceMatchingExceptions.offenceNotMatched.includes(exception.code))

export default getOffenceMatchingExceptions
