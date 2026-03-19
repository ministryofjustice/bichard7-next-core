import type { FormState } from "types/audit/FormState"
import parseDate from "utils/parseDate"

function readFormState(formData: FormData): FormState {
  return {
    resolvedBy: formData.getAll("resolvedBy") as string[],
    triggers: formData.getAll("triggers") as string[],
    includeTriggers: formData.get("includeTriggers") === "on",
    includeExceptions: formData.get("includeExceptions") === "on",
    volume: formData.get("volume") as string,
    fromDate: parseDate(formData.get("fromDate") as string, "yyyy-MM-dd", new Date()),
    toDate: parseDate(formData.get("toDate") as string, "yyyy-MM-dd", new Date())
  }
}

export default readFormState
