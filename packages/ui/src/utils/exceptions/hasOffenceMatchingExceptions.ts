import type { Exception } from "types/exceptions"
import offenceMatchingExceptions from "utils/offenceMatcher/offenceMatchingExceptions"

const PNCExceptions = offenceMatchingExceptions.offenceNotMatched

const filterOffenceMatchingExceptions = (exceptions: Exception[]): Exception[] =>
  exceptions.filter(
    ({ code, path }) => path.join(".").endsWith(".OffenceReasonSequence") && PNCExceptions.includes(code)
  )

const hasOffenceMatchingExceptions = (exceptions: Exception[]): boolean =>
  filterOffenceMatchingExceptions(exceptions).length > 0

export { filterOffenceMatchingExceptions }
export default hasOffenceMatchingExceptions
