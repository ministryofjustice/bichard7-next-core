import { formatInTimeZone } from "date-fns-tz"
import { enGB } from "date-fns/locale"

export default (date: Date = new Date()) => {
  const timeZone = "Europe/London"
  return formatInTimeZone(date, timeZone, "EEE, dd MMM yyyy HH:mm:ss xxxx", { locale: enGB })
}
