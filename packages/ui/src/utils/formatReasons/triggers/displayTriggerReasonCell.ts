import Permission from "@moj-bichard7/common/types/Permission"
import type { DisplayPartialCourtCase } from "types/display/CourtCases"
import type { DisplayTrigger } from "types/display/Triggers"
import type { DisplayFullUser } from "types/display/Users"
import type { ReasonCodes } from "../reasonCodes"

type DisplayTriggerReasonsResult = {
  hasTriggerReasonCodes: boolean
  filteredTriggers: DisplayTrigger[]
  triggers: DisplayTrigger[]
}

export const displayTriggerReasonCell = (
  user: DisplayFullUser,
  courtCase: DisplayPartialCourtCase,
  formattedReasonCodes: ReasonCodes
): DisplayTriggerReasonsResult | undefined => {
  if (!user.hasAccessTo[Permission.Triggers]) {
    return
  }

  const exceptionReasonCodes = formattedReasonCodes.Exceptions
  const triggerReasonCodes = formattedReasonCodes.Triggers

  if (triggerReasonCodes.length === 0 && exceptionReasonCodes.length > 0) {
    return
  }

  const { triggers } = courtCase

  return {
    hasTriggerReasonCodes: triggerReasonCodes.length > 0,
    filteredTriggers: triggers.filter((trigger) => triggerReasonCodes.includes(trigger.triggerCode)),
    triggers
  }
}
