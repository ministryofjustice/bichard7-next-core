import { format } from "date-fns"

export const formatDate = (date: Date | null | string | undefined, includeTime: boolean = false): string => {
  if (!date) {
    return ""
  }

  try {
    return includeTime ? format(new Date(date), "dd/MM/yyyy HH:mm") : format(new Date(date), "dd/MM/yyyy")
  } catch {
    return ""
  }
}
