import { format, isValid, parse } from "date-fns"

export const displayedDateFormat = "dd/MM/yyyy"

export const formInputDateFormat = "yyyy-MM-dd"

export const formatDisplayedDate = (date: Date | string, formatString = displayedDateFormat): string => {
  if (date instanceof Date) {
    return isValid(date) ? format(date, formatString) : ""
  }

  if (typeof date === "string") {
    const dateInstance = new Date(date)
    return isValid(dateInstance) ? format(dateInstance, formatString) : date
  }

  return ""
}

export const formatFormInputDateString = (date: Date): string =>
  isValid(date) ? format(date, formInputDateFormat) : ""

export const formatStringDateAsDisplayedDate = (dateString?: string | null): string => {
  const dateStringAsDate = !!dateString && parse(dateString, formInputDateFormat, new Date())
  return dateStringAsDate && isValid(dateStringAsDate) ? formatDisplayedDate(dateStringAsDate) : ""
}
