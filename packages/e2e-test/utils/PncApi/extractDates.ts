import type { ParsedNcmOffence } from "../../types/ParsedNcm"

type ExtractDates = { startDate: string; endDate: string }

const reformatDate = (input: string): string => {
  const res = input.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!res) {
    throw new Error("Error reformatting Date")
  }

  return `${res[3]}${res[2]}${res[1]}`.padEnd(12, "0")
}

const extractDates = (offence: ParsedNcmOffence): ExtractDates => {
  const startDate = reformatDate(offence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate)
  let endDate

  if (
    offence.BaseOffenceDetails.OffenceTiming.OffenceEnd &&
    offence.BaseOffenceDetails.OffenceTiming.OffenceEnd.OffenceEndDate
  ) {
    endDate = reformatDate(offence.BaseOffenceDetails.OffenceTiming.OffenceEnd.OffenceEndDate)
  } else {
    endDate = "            "
  }

  return { startDate, endDate }
}

export default extractDates
