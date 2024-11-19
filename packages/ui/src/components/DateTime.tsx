import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"

interface Props {
  date?: Date | null | string
  dateFormat?: string
  prefix?: string
}

const DateTime = ({ date, dateFormat = "dd/MM/yyyy HH:mm:ss", prefix }: Props) => {
  if (!date) {
    return <></>
  }

  const dateObject = new Date(date)
  const zonedDate = toZonedTime(dateObject, "Europe/London")

  return (
    <>
      {prefix}
      <time aria-label="time">{format(zonedDate, dateFormat)}</time>
    </>
  )
}

export default DateTime
