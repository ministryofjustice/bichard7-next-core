import DateInput from "components/CustomDateInput/DateInput"
import { isAfter, isBefore, startOfToday, subDays } from "date-fns"
import { useMemo } from "react"

interface DateRangeProps {
  dateFromString: string
  dateToString: string
  setDateFromString: (value: string) => void
  setDateToString: (value: string) => void
  dateFromError?: string | null
  dateToError?: string | null
}

export const DateRange: React.FC<DateRangeProps> = ({
  setDateFromString,
  setDateToString,
  dateFromString,
  dateToString,
  dateFromError,
  dateToError
}) => {
  const thirtyOneDaysAgo = useMemo(() => subDays(startOfToday(), 31), [])

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

  return (
    <>
      <h2 className="govuk-heading-m">{"Date range"}</h2>
      <div className="calendars-wrapper">
        <div id="report-selection-date-from" className="date">
          <DateInput
            dateType="resolvedFrom"
            dispatch={(p) => setDateFromString(p.value as string)}
            value={dateFromString}
            dateRange={undefined}
            minValue={thirtyOneDaysAgo}
            maxValue={calculateDateFromMaxValue(dateToString)}
            showError={!!dateFromError}
            errorMessage={dateFromError ?? ""}
          />
        </div>
        <div id="report-selection-date-to" className="date">
          <DateInput
            dateType="resolvedTo"
            dispatch={(p) => setDateToString(p.value as string)}
            value={dateToString}
            dateRange={undefined}
            minValue={calculateDateToMinValue(dateFromString)}
            maxValue={startOfToday()}
            showError={!!dateToError}
            errorMessage={dateToError ?? ""}
          />
        </div>
      </div>
    </>
  )
}
