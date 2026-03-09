import { isBefore, isFuture, startOfToday, subDays } from "date-fns"
import type { ReportType } from "types/reports/ReportType"

const FIELD_REQUIRED_ERROR = "This field is required"
const AT_LEAST_ONE_CHECKBOX_REQUIRED = "At least one option must be selected"
const DATE_CANNOT_BE_IN_THE_FUTURE = "Date cannot be in the future"
const DATE_SHOULD_BE_WITHIN_THE_LAST_31_DAYS = "Date should be within the last 31 days"
const DATE_CANNOT_BE_AFTER_DATE_TO = "Date cannot be after 'Date to'"
const DATE_CANNOT_BE_BEFORE_DATE_FROM = "Date cannot be before 'Date from'"

export const validateDateField = (dateString: string): string | null => {
  if (!dateString) {
    return FIELD_REQUIRED_ERROR
  }

  const date = new Date(dateString)
  const thirtyOneDaysAgo = subDays(startOfToday(), 31)

  if (isBefore(date, thirtyOneDaysAgo)) {
    return DATE_SHOULD_BE_WITHIN_THE_LAST_31_DAYS
  }

  if (isFuture(date)) {
    return DATE_CANNOT_BE_IN_THE_FUTURE
  }

  return null
}

export const validateDateRange = (dateFromStr: string, dateToStr: string) => {
  const fromError = validateDateField(dateFromStr)
  const toError = validateDateField(dateToStr)

  if (fromError || toError) {
    return { fromError, toError }
  }

  const dateFrom = new Date(dateFromStr)
  const dateTo = new Date(dateToStr)

  if (isBefore(dateTo, dateFrom)) {
    return {
      fromError: DATE_CANNOT_BE_AFTER_DATE_TO,
      toError: DATE_CANNOT_BE_BEFORE_DATE_FROM
    }
  }

  return { fromError: null, toError: null }
}

export const validateCheckboxes = (
  reportType: ReportType | undefined,
  triggers: boolean,
  exceptions: boolean
): Record<string, string | null> => {
  const errors: Record<string, string | null> = {
    checkboxes: null
  }

  if (reportType === "exceptions" && !triggers && !exceptions) {
    errors.checkboxes = AT_LEAST_ONE_CHECKBOX_REQUIRED
  }

  return errors
}

export const validateSelectReport = (reportType: ReportType | undefined): Record<string, string | null> => {
  const errors: Record<string, string | null> = {
    reportType: !reportType ? FIELD_REQUIRED_ERROR : null
  }

  return errors
}
