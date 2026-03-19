import { parse } from "date-fns"

function parseDate(dateStr: string | undefined, format: string, defaultDate: Date): Date {
  if (!dateStr) {
    return defaultDate
  }

  const parsedDate = parse(dateStr, format, new Date())
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date(defaultDate)
  }

  return parsedDate
}

export default parseDate
