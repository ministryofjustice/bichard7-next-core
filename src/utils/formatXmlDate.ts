import { format } from "date-fns"

export default (date: string): string | undefined => (date ? format(new Date(date), "yyyy-MM-dd") : undefined)
