import { isAfter } from "date-fns"
import { dateRange } from "./dateRange"
import { validateDateField } from "./validateDateField"
import {
  DATE_CANNOT_BE_AFTER_DATE_TO,
  DATE_EXCEEDS_MAX_RANGE,
  DATE_CANNOT_BE_BEFORE_DATE_FROM
} from "./validationMessages"
import { isError } from "@moj-bichard7/common/types/Result"

export const validateDateRange = (dateFromStr: string, dateToStr: string) => {
  const fromError = validateDateField(dateFromStr)
  const toError = validateDateField(dateToStr)

  if (fromError || toError) {
    return { fromError, toError }
  }

  const dateFrom = new Date(dateFromStr)
  const dateTo = new Date(dateToStr)

  if (isAfter(dateFrom, dateTo)) {
    return {
      fromError: DATE_CANNOT_BE_AFTER_DATE_TO,
      toError: DATE_CANNOT_BE_BEFORE_DATE_FROM
    }
  }

  const range = dateRange(dateFrom)

  if (isError(range)) {
    return { fromError: range.message, toError: null }
  }

  if (isAfter(dateTo, range.endDate)) {
    return { fromError: null, toError: DATE_EXCEEDS_MAX_RANGE }
  }

  return { fromError: null, toError: null }
}
