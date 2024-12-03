import { EXCEPTION_PATH_PROPERTY_INDEXES } from "config"
import type { Amendments } from "types/Amendments"
import type { Exception } from "types/exceptions"
import hasNextHearingDateExceptions from "./exceptions/hasNextHearingDateExceptions"
import hasNextHearingLocationException from "./exceptions/hasNextHearingLocationException"
import hasOffenceMatchingExceptions from "./exceptions/hasOffenceMatchingExceptions"

export type OffenceAlert = {
  offenceIndex: string | number
  isResolved: boolean
}

const hasException = (
  field: "nextHearingDate" | "nextSourceOrganisation" | "offenceReasonSequence",
  exception: Exception
): boolean => {
  switch (field) {
    case "nextHearingDate":
      return hasNextHearingDateExceptions([exception])
    case "nextSourceOrganisation":
      return hasNextHearingLocationException([exception])
    case "offenceReasonSequence":
      return hasOffenceMatchingExceptions([exception])
    default:
      return false
  }
}

const exceptionsResolvedFn = (
  field: "nextHearingDate" | "nextSourceOrganisation" | "offenceReasonSequence",
  updatedFields: Amendments,
  exception: Exception,
  offenceIndex: number,
  resultIndex: number
): boolean => {
  if (field !== "offenceReasonSequence" && hasException(field, exception)) {
    return Boolean(
      updatedFields?.[field]?.some(
        (f) => "resultIndex" in f && f.offenceIndex === offenceIndex && f.resultIndex === resultIndex
      )
    )
  } else if (field == "offenceReasonSequence" && hasException(field, exception)) {
    return Boolean(updatedFields?.[field]?.some((f) => f.offenceIndex === offenceIndex))
  } else {
    return false
  }
}

const getOffenceAlertsDetails = (exceptions: Exception[], updatedFields: Amendments): OffenceAlert[] => {
  const offenceAlerts: OffenceAlert[] = []

  exceptions.forEach((exception) => {
    const offenceIndex = exception.path[EXCEPTION_PATH_PROPERTY_INDEXES.offenceIndex]
    const resultIndex = exception.path[EXCEPTION_PATH_PROPERTY_INDEXES.resultIndex]

    const isResolved =
      exceptionsResolvedFn("nextHearingDate", updatedFields, exception, +offenceIndex, +resultIndex) ||
      exceptionsResolvedFn("nextSourceOrganisation", updatedFields, exception, +offenceIndex, +resultIndex) ||
      exceptionsResolvedFn("offenceReasonSequence", updatedFields, exception, +offenceIndex, +resultIndex)

    const existingAlert = offenceAlerts.find((alert) => alert.offenceIndex === offenceIndex)

    if (existingAlert) {
      existingAlert.isResolved = existingAlert.isResolved && isResolved
      return
    }

    offenceAlerts.push({ offenceIndex, isResolved })
  })

  return offenceAlerts
}

export { exceptionsResolvedFn }
export default getOffenceAlertsDetails
