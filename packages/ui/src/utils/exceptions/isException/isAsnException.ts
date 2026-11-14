import ExceptionCode from "@moj-bichard7/standing-data/types/ExceptionCode"
import type { Exception } from "types/exceptions"

const asnExceptions = [ExceptionCode.HO100206, ExceptionCode.HO100301, ExceptionCode.HO100321]

const isAsnException = (exceptions: Exception[]): boolean =>
  exceptions.some((exception) => asnExceptions.includes(exception.code))

export default isAsnException
