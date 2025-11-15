type LedsDateTime = { date: string; time?: string }

const londonDateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
})

const formatToLondonTimezone = (date: Date) => {
  const parts = londonDateTimeFormatter.formatToParts(date)
  const get = (timePart: string) => Number(parts.find((p) => p.type === timePart)?.value)

  return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"))
}

const convertPncDateTimeToLedsDateTime = (pncDate: string, pncTime?: string): LedsDateTime => {
  const dayOfMonth = Number(pncDate.substring(0, 2))
  const month = Number(pncDate.substring(2, 4))
  const year = Number(pncDate.substring(4, 8))
  const date = `${year}-${String(month).padStart(2, "0")}-${String(dayOfMonth).padStart(2, "0")}`

  if (!pncTime) {
    return { date }
  }

  const hour = Number(pncTime.substring(0, 2))
  const minute = Number(pncTime.substring(2, 4))
  const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`

  const baselineUtcMilliseconds = Date.UTC(year, month - 1, dayOfMonth, hour, minute)
  const baselineUtcDate = new Date(baselineUtcMilliseconds)
  const formattedLondonMilliseconds = formatToLondonTimezone(baselineUtcDate)

  const offsetMinutes = Math.round((formattedLondonMilliseconds - baselineUtcMilliseconds) / 60_000)

  const sign = offsetMinutes >= 0 ? "+" : "-"
  const offsetMinutesAbs = Math.abs(offsetMinutes)
  const offsetHoursPart = String(Math.floor(offsetMinutesAbs / 60)).padStart(2, "0")
  const offsetMinutesPart = String(offsetMinutesAbs % 60).padStart(2, "0")

  return {
    date,
    time: `${time}${sign}${offsetHoursPart}:${offsetMinutesPart}`
  }
}

export default convertPncDateTimeToLedsDateTime
