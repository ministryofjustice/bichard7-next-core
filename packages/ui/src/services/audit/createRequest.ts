import type { CreateAuditInput } from "@moj-bichard7/common/contracts/CreateAuditInput"
import { format } from "date-fns"
import type { FormState } from "../../types/audit/FormState"

function createRequest(newState: FormState): CreateAuditInput {
  const includedTypes: ("Exceptions" | "Triggers")[] = []
  if (newState.includeExceptions) {
    includedTypes.push("Exceptions")
  }

  if (newState.includeTriggers) {
    includedTypes.push("Triggers")
  }

  return {
    fromDate: format(newState.fromDate, "yyyy-MM-dd"),
    toDate: format(newState.toDate, "yyyy-MM-dd"),
    includedTypes: includedTypes,
    volumeOfCases: Number.parseInt(newState.volume, 10),
    resolvedByUsers: newState.resolvedBy,
    triggerTypes: newState.triggers
  }
}

export default createRequest
