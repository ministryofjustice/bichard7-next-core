import { format } from "date-fns"

export default (date: string | undefined): string | undefined =>
  date ? format(new Date(date), "yyyy-MM-dd") : undefined
