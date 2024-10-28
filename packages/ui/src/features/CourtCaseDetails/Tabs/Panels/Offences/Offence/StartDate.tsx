import { DateCodes } from "@moj-bichard7-developers/bichard7-next-data/dist/types/DateCode"
import { DateCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import type { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { textSecondary } from "utils/colours"
import { formatDisplayedDate } from "utils/date/formattedDate"
import { capitalizeString } from "utils/valueTransformers"

interface StartDateProps {
  offence: Offence
}

export const StartDate = ({ offence }: StartDateProps) => {
  const { ActualOffenceDateCode, ActualOffenceStartDate, ActualOffenceEndDate } = offence

  const startDate = formatDisplayedDate(ActualOffenceStartDate.StartDate)
  const endDate = formatDisplayedDate(ActualOffenceEndDate?.EndDate || "")
  const dateField = endDate ? `${startDate} and ${endDate}` : startDate

  return (
    <>
      <div>{capitalizeString(DateCodes[parseInt(ActualOffenceDateCode) as DateCode])}</div>
      <div>{dateField}</div>
      <div style={{ color: textSecondary }}>{`Date code: ${ActualOffenceDateCode}`}</div>
    </>
  )
}
