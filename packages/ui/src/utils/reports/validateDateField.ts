import { isFuture, isValid, isBefore, startOfMonth, subMonths, startOfToday } from "date-fns"
import {
  DATE_CANNOT_BE_IN_THE_FUTURE,
  DATE_SHOULD_BE_WITHIN_THE_LAST_12_MONTHS,
  FIELD_REQUIRED
} from "./validationMessages"

export const validateDateField = (dateString: string): string | null => {
  const date = new Date(dateString)

  if (!dateString || !isValid(date)) {
    return FIELD_REQUIRED
  }

  if (isBefore(date, startOfMonth(subMonths(startOfToday(), 12)))) {
    return DATE_SHOULD_BE_WITHIN_THE_LAST_12_MONTHS
  }

  if (isFuture(date)) {
    return DATE_CANNOT_BE_IN_THE_FUTURE
  }

  return null
}
