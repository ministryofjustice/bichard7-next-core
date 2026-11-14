import { DateCodes } from "@moj-bichard7/standing-data/types/DateCode"
import { DateCode } from "@moj-bichard7/standing-data/types/types"
import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import { capitalizeString } from "@moj-bichard7/common/utils/valueTransformers"
import { textSecondary } from "utils/colours"
import { formatDisplayedDate } from "utils/date/formattedDate"

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
