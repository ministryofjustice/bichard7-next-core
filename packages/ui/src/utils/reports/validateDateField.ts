import { isBefore, isFuture, startOfToday, subDays } from "date-fns"
import {
  DATE_CANNOT_BE_IN_THE_FUTURE,
  DATE_SHOULD_BE_WITHIN_THE_LAST_31_DAYS,
  FIELD_REQUIRED
} from "./validationMessages"

export const validateDateField = (dateString: string): string | null => {
  const date = new Date(dateString)
  const thirtyOneDaysAgo = subDays(startOfToday(), 31)

  if (!dateString) {
    return FIELD_REQUIRED
  }

  if (isBefore(date, thirtyOneDaysAgo)) {
    return DATE_SHOULD_BE_WITHIN_THE_LAST_31_DAYS
  }

  if (isFuture(date)) {
    return DATE_CANNOT_BE_IN_THE_FUTURE
  }

  return null
}
