import type { GroupedReportConfig } from "types/reports/Config"
import parseDate from "utils/parseDate"
import { format } from "date-fns"

export const formatGroupName = (config: GroupedReportConfig<Record<string, never>, never>, groupName: string) => {
  switch (config.formatter) {
    case "date":
      return format(parseDate(groupName.slice(0, 10), "yyyy-MM-dd", new Date()), "dd/MM/yyyy")
    default:
      return groupName
  }
}
