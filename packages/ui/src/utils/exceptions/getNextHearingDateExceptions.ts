import type { Exception } from "types/exceptions"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

const getNextHearingDateExceptions = (exceptions: Exception[]): Exception[] => {
  const nextHearingDateExceptions = [ExceptionCode.HO100102, ExceptionCode.HO100323]
  return exceptions.filter(({ code }) => nextHearingDateExceptions.includes(code))
}

export default getNextHearingDateExceptions
