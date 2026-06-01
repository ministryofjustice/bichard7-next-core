import { dateRange } from "@/utils/reports/dateRange"
import DateInput from "components/CustomDateInput/DateInput"
import { startOfMonth, startOfToday, subMonths } from "date-fns"
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
  const today = startOfToday()
  const earliestAllowedDate = useMemo(() => startOfMonth(subMonths(today, 12)), [])

  const dateToConstraints = useMemo(() => {
    if (dateFromString === "") {
      return null
    }

    const result = dateRange(new Date(dateFromString))
    return result instanceof Error ? null : result
  }, [dateFromString])

  const handleDateFromChange = (value: string) => {
    setDateFromString(value)
    setDateToString("")

    if (value === "") {
      setDateToString("")
      return
    }

    const result = dateRange(new Date(value))

    if (result instanceof Error) {
      setDateToString("")
    } else {
      setDateToString(result.endDate.toISOString().slice(0, 10))
    }
  }

  return (
    <>
      <h2 className="govuk-heading-m">{"Date range"}</h2>
      <div className="calendars-wrapper">
        <div id="report-selection-date-from" className="date">
          <DateInput
            dateType="from"
            dispatch={(p) => handleDateFromChange(p.value as string)}
            value={dateFromString}
            dateRange={undefined}
            minValue={earliestAllowedDate}
            maxValue={today}
            showError={!!dateFromError}
            errorMessage={dateFromError ?? ""}
          />
        </div>
        <div id="report-selection-date-to" className="date">
          <DateInput
            dateType="to"
            dispatch={(p) => setDateToString(p.value as string)}
            value={dateToString}
            dateRange={undefined}
            minValue={dateToConstraints?.startDate ?? earliestAllowedDate}
            maxValue={dateToConstraints?.endDate ?? today}
            disabled={dateFromString === ""}
            showError={!!dateToError}
            errorMessage={dateToError ?? ""}
          />
        </div>
      </div>
    </>
  )
}
