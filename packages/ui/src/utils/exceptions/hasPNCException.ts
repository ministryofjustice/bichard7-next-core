import type { Exception } from "types/exceptions"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

const PNCExceptions = [ExceptionCode.HO100310, ExceptionCode.HO100332]

const filterPNCMatchingExceptions = (exceptions: Exception[]): Exception[] =>
  exceptions.filter(
    ({ code, path }) => path.join(".").endsWith(".OffenceReasonSequence") && PNCExceptions.includes(code)
  )

const hasPNCMatchingExceptions = (exceptions: Exception[]): boolean =>
  filterPNCMatchingExceptions(exceptions).length > 0

export { filterPNCMatchingExceptions }
export default hasPNCMatchingExceptions
