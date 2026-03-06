import DateInput from "components/CustomDateInput/DateInput"
import { isAfter, isBefore, isFuture, startOfToday, subDays } from "date-fns"
import { forwardRef, useImperativeHandle, useState } from "react"

const FIELD_REQUIRED_ERROR = "This field is required"
const DATE_CANNOT_BE_IN_THE_FUTURE = "Date cannot be in the future"
const DATE_SHOULD_BE_WITHIN_THE_LAST_31_DAYS = "Date should be within the last 31 days"
const DATE_CANNOT_BE_AFTER_DATE_TO = "Date cannot be after 'Date to'"
const DATE_CANNOT_BE_BEFORE_DATE_FROM = "Date cannot be before 'Date from'"

interface DateRangeProps {
  setDateFromString: React.Dispatch<React.SetStateAction<string>>
  setDateToString: React.Dispatch<React.SetStateAction<string>>
  setHasRun: React.Dispatch<React.SetStateAction<boolean>>
  dateFromString: string
  dateToString: string
}

export interface DateRangeRef {
  validateRange: () => boolean
}

export const DateRange = forwardRef<DateRangeRef, DateRangeProps>(
  ({ setDateFromString, setDateToString, setHasRun, dateFromString, dateToString }, ref) => {
    const [thirtyOneDaysAgo] = useState<Date>(subDays(startOfToday(), 31))
    const [showDateFromError, setShowDateFromError] = useState<boolean>(false)
    const [showDateToError, setShowDateToError] = useState<boolean>(false)
    const [dateFromErrorMessage, setDateFromErrorMessage] = useState<string>("")
    const [dateToErrorMessage, setDateToErrorMessage] = useState<string>("")

    const validateRange = (): boolean => {
      const validateDateField = (
        setError: React.Dispatch<React.SetStateAction<boolean>>,
        setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
        dateString: string
      ): boolean => {
        const date = new Date(dateString)
        if (dateString === "") {
          setError(true)
          setErrorMessage(FIELD_REQUIRED_ERROR)
          return false
        } else if (isBefore(date, thirtyOneDaysAgo)) {
          setError(true)
          setErrorMessage(DATE_SHOULD_BE_WITHIN_THE_LAST_31_DAYS)
          return false
        } else if (isFuture(date)) {
          setError(true)
          setErrorMessage(DATE_CANNOT_BE_IN_THE_FUTURE)
          return false
        } else {
          return true
        }
      }

      const isDateFromValid = validateDateField(setShowDateFromError, setDateFromErrorMessage, dateFromString)
      const isDateToValid = validateDateField(setShowDateToError, setDateToErrorMessage, dateToString)

      if (!isDateFromValid || !isDateToValid) {
        return false
      }

      const dateFrom = new Date(dateFromString)
      const dateTo = new Date(dateToString)

      if (dateFromString !== "" && dateToString !== "" && isBefore(dateTo, dateFrom)) {
        setShowDateFromError(true)
        setShowDateToError(true)
        setDateFromErrorMessage(DATE_CANNOT_BE_AFTER_DATE_TO)
        setDateToErrorMessage(DATE_CANNOT_BE_BEFORE_DATE_FROM)
        return false
      }

      return true
    }

    const calculateDateFromMaxValue = (dateToString: string): Date => {
      if (dateToString === "") {
        return startOfToday()
      } else {
        const dateTo = new Date(dateToString)
        return isBefore(dateTo, startOfToday()) ? dateTo : startOfToday()
      }
    }

    const calculateDateToMinValue = (dateFromString: string): Date => {
      if (dateFromString === "") {
        return thirtyOneDaysAgo
      } else {
        const dateFrom = new Date(dateFromString)
        return isAfter(dateFrom, thirtyOneDaysAgo) ? dateFrom : thirtyOneDaysAgo
      }
    }

    const onDateFromChange = (value: string) => {
      setDateFromString(value)
      setShowDateFromError(false)
      setHasRun(false)

      const newDateFrom = new Date(value)
      const dateTo = new Date(dateToString)

      if (dateToString !== "" && !isBefore(dateTo, newDateFrom)) {
        setShowDateToError(false)
      }
    }

    const onDateToChange = (value: string) => {
      setDateToString(value)
      setShowDateToError(false)
      setHasRun(false)

      const newDateTo = new Date(value)
      const dateFrom = new Date(dateFromString)

      if (dateFromString !== "" && !isAfter(dateFrom, newDateTo)) {
        setShowDateFromError(false)
      }
    }

    useImperativeHandle(ref, () => ({
      validateRange
    }))

    return (
      <>
        <h2 className={"govuk-heading-m"}>{"Date range"}</h2>
        <div className="calendars-wrapper">
          <div id={"report-selection-date-from"} className="date">
            <DateInput
              dateType="resolvedFrom"
              dispatch={(p) => {
                onDateFromChange(p.value as string)
              }}
              value={dateFromString}
              dateRange={undefined}
              minValue={thirtyOneDaysAgo}
              maxValue={calculateDateFromMaxValue(dateToString)}
              showError={showDateFromError}
              errorMessage={dateFromErrorMessage}
            />
          </div>
          <div id={"report-selection-date-to"} className="date">
            <DateInput
              dateType="resolvedTo"
              dispatch={(p) => {
                onDateToChange(p.value as string)
              }}
              value={dateToString}
              dateRange={undefined}
              minValue={calculateDateToMinValue(dateFromString)}
              maxValue={startOfToday()}
              showError={showDateToError}
              errorMessage={dateToErrorMessage}
            />
          </div>
        </div>
      </>
    )
  }
)

DateRange.displayName = "DateRange"
