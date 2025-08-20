import type { Amendments } from "types/Amendments"
import type { Exception } from "types/exceptions"
import type { ExceptionDetails } from "types/TabDetails"
import getNextHearingLocationExceptions from "utils/exceptions/getNextHearingLocationExceptions"

const getNextHearingLocationExceptionsDetails = (
  exceptions: Exception[],
  savedAmendments: Amendments
): ExceptionDetails => {
  const nextHearingLocationExceptionsCount = getNextHearingLocationExceptions(exceptions).length
  const nextHearingLocationExceptionsCountFromUpdatedFields = savedAmendments?.nextSourceOrganisation?.length ?? 0
  return {
    ExceptionsCount: nextHearingLocationExceptionsCount - nextHearingLocationExceptionsCountFromUpdatedFields,
    ExceptionsResolved:
      nextHearingLocationExceptionsCount > 0 &&
      nextHearingLocationExceptionsCount === nextHearingLocationExceptionsCountFromUpdatedFields
  }
}

export default getNextHearingLocationExceptionsDetails
