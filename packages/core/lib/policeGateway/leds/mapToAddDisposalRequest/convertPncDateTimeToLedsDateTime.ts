type LedsDateTime = { date: string; time?: string }

const convertPncDateTimeToLedsDateTime = (pncDate: string, pncTime?: string): LedsDateTime => {
  const dayOfMonth = pncDate.substring(0, 2)
  const month = pncDate.substring(2, 4)
  const year = pncDate.substring(4, 8)
  const date = `${year}-${month}-${dayOfMonth}`

  if (!pncTime) {
    return { date }
  }

  const hour = pncTime.substring(0, 2)
  const minute = pncTime.substring(2, 4)
  const time = `${hour}:${minute}`

  const londonDateTime = new Date(`${date}T${time}:00`)
  const londonOffsetMinutes = -londonDateTime.getTimezoneOffset()

  // Convert offset to hours and minutes
  const offsetHours = String(Math.floor(Math.abs(londonOffsetMinutes) / 60)).padStart(2, "0")
  const offsetMinutes = String(Math.abs(londonOffsetMinutes) % 60).padStart(2, "0")
  const sign = londonOffsetMinutes >= 0 ? "+" : "-"

  // Return the original local time with the correct offset
  return {
    date,
    time: `${time}${sign}${offsetHours}:${offsetMinutes}`
  }
}

export default convertPncDateTimeToLedsDateTime
