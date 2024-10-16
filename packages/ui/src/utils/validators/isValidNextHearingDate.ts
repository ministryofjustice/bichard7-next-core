import { DATE_FNS } from "config"
import { compareAsc, parse } from "date-fns"
import { enGB } from "date-fns/locale"

const isValidNextHearingDate = (
  amendedNextHearingDate: string | undefined,
  resultHearingDate: Date | string | undefined
): boolean => {
  if (!amendedNextHearingDate) {
    return false
  }

  const parsedDate = parse(amendedNextHearingDate, "yyyy-MM-dd", new Date(), { locale: enGB })

  if (!parsedDate) {
    return false
  }

  if (resultHearingDate) {
    return compareAsc(parsedDate, new Date(resultHearingDate)) === DATE_FNS.dateInFuture
  } else {
    return false
  }
}

export default isValidNextHearingDate
