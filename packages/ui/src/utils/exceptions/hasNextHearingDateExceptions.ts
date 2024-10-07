import { Exception } from "types/exceptions"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

const nextHearingDateExceptions = [ExceptionCode.HO100102, ExceptionCode.HO100323]

const filterNextHearingDateExceptions = (exceptions: Exception[]): Exception[] =>
  exceptions.filter(
    ({ code, path }) => path.join(".").endsWith(".NextHearingDate") && nextHearingDateExceptions.includes(code)
  )

const hasNextHearingDateExceptions = (exceptions: Exception[]): boolean =>
  filterNextHearingDateExceptions(exceptions).length > 0

export { filterNextHearingDateExceptions }
export default hasNextHearingDateExceptions
