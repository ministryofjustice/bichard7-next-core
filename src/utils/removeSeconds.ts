import { format } from "date-fns"

export default (time: string): string => {
  if (!time) {
    return time
  }

  const date = new Date()
  const timeParts = time.split(":")
  date.setHours(parseInt(timeParts[0], 10))
  date.setMinutes(parseInt(timeParts[1], 10))

  return format(date, "HH:mm")
}
