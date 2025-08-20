import type { Amendments } from "types/Amendments"
import type { Exception } from "types/exceptions"
import isAsnFormatValid from "utils/exceptions/isAsnFormatValid"
import isAsnException from "utils/exceptions/isException/isAsnException"
import type { ExceptionDetails } from "types/TabDetails"

const getAsnExceptionDetails = (
  exceptions: Exception[],
  updatedFields: Amendments,
  savedAmendments: Amendments
): ExceptionDetails => {
  const asnExceptionCount = +isAsnException(exceptions)

  let saved: boolean = false

  if (savedAmendments?.asn) {
    saved = true
  }

  const asnExceptionCountFromUpdatedFields =
    saved && isAsnFormatValid(updatedFields?.asn ?? "") && savedAmendments.asn === updatedFields.asn ? 1 : 0

  return {
    ExceptionsCount: asnExceptionCount - asnExceptionCountFromUpdatedFields,
    ExceptionsResolved: asnExceptionCount > 0 && asnExceptionCount === asnExceptionCountFromUpdatedFields
  }
}

export default getAsnExceptionDetails
