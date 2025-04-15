import Permission from "@moj-bichard7/common/types/Permission"
import type { DisplayPartialCourtCase } from "types/display/CourtCases"
import type { DisplayFullUser } from "types/display/Users"
import { displayExceptions } from "./displayExceptions"
import groupErrorsFromReport from "./groupErrorsFromReport"
import type { ReasonCodes } from "./reasonCodes"

type DisplayExceptionReasonsResult = {
  hasExceptionReasonCodes: boolean
  filteredExceptions: Record<string, number>
  exceptions: Record<string, number>
}

export const displayExceptionReasons = (
  user: DisplayFullUser,
  courtCase: DisplayPartialCourtCase,
  state: string | string[] | undefined,
  formattedReasonCodes: ReasonCodes
): DisplayExceptionReasonsResult | undefined => {
  if (!user.hasAccessTo[Permission.Exceptions]) {
    return undefined
  }

  if (!displayExceptions(courtCase.errorStatus, state)) {
    return undefined
  }

  const exceptionReasonCodes = formattedReasonCodes.Exceptions
  const triggerReasonCodes = formattedReasonCodes.Triggers

  if (exceptionReasonCodes.length === 0 && triggerReasonCodes.length > 0) {
    return undefined
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
