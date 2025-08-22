import type { Amendments } from "types/Amendments"
import type { Exception } from "types/exceptions"
import type { ExceptionDetails } from "types/TabDetails"
import getNextHearingDateExceptions from "utils/exceptions/getNextHearingDateExceptions"

const getNextHearingDateExceptionsDetails = (
  exceptions: Exception[],
  savedAmendments: Amendments
): ExceptionDetails => {
  const nextHearingDateExceptionsCount = getNextHearingDateExceptions(exceptions).length
  const nextHearingDateExceptionsCountFromUpdatedFields = savedAmendments?.nextHearingDate?.length ?? 0

  return {
    ExceptionsCount: nextHearingDateExceptionsCount - nextHearingDateExceptionsCountFromUpdatedFields,
    ExceptionsResolved:
      nextHearingDateExceptionsCount > 0 &&
      nextHearingDateExceptionsCount === nextHearingDateExceptionsCountFromUpdatedFields
  }
}

export default getNextHearingDateExceptionsDetails
