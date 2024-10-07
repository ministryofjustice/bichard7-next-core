import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { Exception } from "types/exceptions"

const offenceMatchingExceptions = [ExceptionCode.HO100310]

const filterOffenceMatchingException = (exceptions: Exception[]): Exception[] =>
  exceptions.filter((exception) => offenceMatchingExceptions.includes(exception.code))

const hasOffenceMatchingExceptions = (exceptions: Exception[]) => filterOffenceMatchingException(exceptions).length > 0

export { filterOffenceMatchingException }
export default hasOffenceMatchingExceptions
