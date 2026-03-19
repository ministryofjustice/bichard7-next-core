import { parse } from "date-fns"

function parseDate(dateStr: string, format: string, defaultDate: Date): Date {
  const parsedDate = parse(dateStr, format, new Date())
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date(defaultDate)
  }

  return parsedDate
}

export default parseDate
