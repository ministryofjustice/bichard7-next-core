import type { Exception } from "types/exceptions"
import ExceptionCode from "@moj-bichard7/standing-data/types/ExceptionCode"

const getNextHearingLocationExceptions = (exceptions: Exception[]): Exception[] => {
  const nextHearingLocationExceptions = [ExceptionCode.HO100200, ExceptionCode.HO100300, ExceptionCode.HO100322]
  return exceptions.filter(({ code }) => nextHearingLocationExceptions.includes(code))
}

export default getNextHearingLocationExceptions
