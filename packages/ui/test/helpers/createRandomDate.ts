import { differenceInDays, subDays } from "date-fns"

const randomDate = (from: Date, to: Date): Date => {
  const dateRangeDays = differenceInDays(from, to)
  return subDays(to, Math.round(Math.random() * dateRangeDays))
}

export default randomDate
