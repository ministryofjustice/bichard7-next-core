import { format } from "date-fns"
import type { Formatter } from "types/reports/Config"
import parseDate from "utils/parseDate"

export const formatGroupName = (config: Formatter, groupName: string) => {
  switch (config.formatter) {
    case "date":
      return format(parseDate(groupName.slice(0, 10), "yyyy-MM-dd", new Date()), "dd/MM/yyyy")
    default:
      return groupName
  }
}
