import { format } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"

export const formatDate = (
  date: Date | null | string | undefined,
  includeTime: boolean = false,
  includeTimezone: boolean = false
): string => {
  if (!date) {
    return ""
  }

  try {
    const dateObj = new Date(date)

    const formatStr = includeTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"

    return includeTimezone ? formatInTimeZone(dateObj, "Europe/London", formatStr) : format(dateObj, formatStr)
  } catch {
    return ""
  }
}
