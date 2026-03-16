import { isBefore } from "date-fns"
import { validateDateField } from "./validateDateField"
import { DATE_CANNOT_BE_AFTER_DATE_TO, DATE_CANNOT_BE_BEFORE_DATE_FROM } from "./validationMessages"

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
