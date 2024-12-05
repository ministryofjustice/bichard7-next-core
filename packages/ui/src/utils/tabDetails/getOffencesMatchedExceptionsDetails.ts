import type { Amendments } from "types/Amendments"
import type { Exception } from "types/exceptions"
import getOffenceMatchingExceptions from "utils/offenceMatcher/getOffenceMatchingExceptions"
import type { ExceptionDetails } from "./getTabDetails"

const getOffencesMatchedExceptionsDetails = (exceptions: Exception[], amendments: Amendments): ExceptionDetails => {
  const offencesMatchedExceptionsCount = getOffenceMatchingExceptions(exceptions).length
  const offencesMatchedExceptionsCountFromUpdatedFields =
    (offencesMatchedExceptionsCount > 0 && amendments?.offenceReasonSequence?.length) || 0
  return {
    ExceptionsCount: offencesMatchedExceptionsCount - offencesMatchedExceptionsCountFromUpdatedFields,
    ExceptionsResolved:
      offencesMatchedExceptionsCount > 0 &&
      offencesMatchedExceptionsCount === offencesMatchedExceptionsCountFromUpdatedFields
  }
}

export default getOffencesMatchedExceptionsDetails
