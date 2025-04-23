import Permission from "@moj-bichard7/common/types/Permission"
import type { DisplayPartialCourtCase } from "types/display/CourtCases"
import type { DisplayFullUser } from "types/display/Users"
import type { ReasonCodes } from "../reasonCodes"
import { displayExceptions } from "./displayExceptions"
import groupErrorsFromReport from "./groupErrorsFromReport"

type DisplayExceptionReasonsResult = {
  hasExceptionReasonCodes: boolean
  filteredExceptions: Record<string, number>
  exceptions: Record<string, number>
}

export const displayExceptionReasons = (
  user: DisplayFullUser,
  courtCase: DisplayPartialCourtCase,
  formattedReasonCodes: ReasonCodes,
  state?: string | string[]
): DisplayExceptionReasonsResult | undefined => {
  if (!user.hasAccessTo[Permission.Exceptions]) {
    return
  }

  if (!displayExceptions(courtCase.errorStatus, state)) {
    return
  }

  const exceptionReasonCodes = formattedReasonCodes.Exceptions
  const triggerReasonCodes = formattedReasonCodes.Triggers

  if (exceptionReasonCodes.length === 0 && triggerReasonCodes.length > 0) {
    return
  }

  const exceptions = groupErrorsFromReport(courtCase.errorReport)
  const filteredExceptions = Object.fromEntries(
    Object.entries(exceptions).filter(([error]) => exceptionReasonCodes.includes(error))
  )

  return {
    hasExceptionReasonCodes: exceptionReasonCodes.length > 0,
    filteredExceptions,
    exceptions
  }
}
