import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import getNextHearingDateExceptions from "./exceptions/getNextHearingDateExceptions"
import getNextHearingLocationExceptions from "./exceptions/getNextHearingLocationExceptions"
import { getOffenceMatchingExceptions } from "./offenceMatcher/getOffenceMatchingException"
import hasNextHearingDateExceptions from "./exceptions/hasNextHearingDateExceptions"
import hasNextHearingLocationException from "./exceptions/hasNextHearingLocationException"
import hasOffenceMatchingExceptions from "./offenceMatcher/hasOffenceMatchingExceptions"
import isAsnFormatValid from "./exceptions/isAsnFormatValid"
import isAsnException from "./exceptions/isException/isAsnException"

export type TabDetails = {
  name: "Defendant" | "Hearing" | "Case" | "Offences" | "Notes"
  exceptionsCount: number
  exceptionsResolved: boolean
}

type ExceptionDetails = {
  ExceptionsCount: number
  ExceptionsResolved: boolean
}

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

const getNextHearingDateExceptionsDetails = (
  exceptions: Exception[],
  savedAmendments: Amendments
): ExceptionDetails => {
  const nextHearingDateExceptionsCount = getNextHearingDateExceptions(exceptions).length
  const nextHearingDateExceptionsCountFromUpdatedFields = savedAmendments?.nextHearingDate?.length || 0

  return {
    ExceptionsCount: nextHearingDateExceptionsCount - nextHearingDateExceptionsCountFromUpdatedFields,
    ExceptionsResolved:
      nextHearingDateExceptionsCount > 0 &&
      nextHearingDateExceptionsCount === nextHearingDateExceptionsCountFromUpdatedFields
  }
}

const getNextHearingLocationExceptionsDetails = (
  exceptions: Exception[],
  savedAmendments: Amendments
): ExceptionDetails => {
  const nextHearingLocationExceptionsCount = getNextHearingLocationExceptions(exceptions).length
  const nextHearingLocationExceptionsCountFromUpdatedFields = savedAmendments?.nextSourceOrganisation?.length || 0
  return {
    ExceptionsCount: nextHearingLocationExceptionsCount - nextHearingLocationExceptionsCountFromUpdatedFields,
    ExceptionsResolved:
      nextHearingLocationExceptionsCount > 0 &&
      nextHearingLocationExceptionsCount === nextHearingLocationExceptionsCountFromUpdatedFields
  }
}

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

const getTabDetails = (
  exceptions: Exception[],
  updatedFields: Amendments,
  savedAmendments: Amendments,
  exceptionsEnabled: boolean
): TabDetails[] => {
  const nextHearingDateExceptionsDetails = getNextHearingDateExceptionsDetails(exceptions, savedAmendments)
  const nextHearingLocationExceptionsDetails = getNextHearingLocationExceptionsDetails(exceptions, savedAmendments)

  const asnExceptionDetails = getAsnExceptionDetails(exceptions, updatedFields, savedAmendments)

  const offencesMatchedExceptionsDetails = getOffencesMatchedExceptionsDetails(exceptions, updatedFields)

  let offencesExceptionsResolved = false

  if (
    hasNextHearingDateExceptions(exceptions) &&
    hasNextHearingLocationException(exceptions) &&
    hasOffenceMatchingExceptions(exceptions)
  ) {
    offencesExceptionsResolved =
      nextHearingDateExceptionsDetails.ExceptionsResolved &&
      nextHearingLocationExceptionsDetails.ExceptionsResolved &&
      offencesMatchedExceptionsDetails.ExceptionsResolved
  } else if (hasNextHearingDateExceptions(exceptions)) {
    offencesExceptionsResolved = nextHearingDateExceptionsDetails.ExceptionsResolved
  } else if (hasNextHearingLocationException(exceptions)) {
    offencesExceptionsResolved = nextHearingLocationExceptionsDetails.ExceptionsResolved
  } else if (hasOffenceMatchingExceptions(exceptions)) {
    offencesExceptionsResolved = offencesMatchedExceptionsDetails.ExceptionsResolved
  }

  const defendantExceptionsCount = exceptionsEnabled ? asnExceptionDetails.ExceptionsCount : 0
  const offencesExceptionsCount = exceptionsEnabled
    ? nextHearingDateExceptionsDetails.ExceptionsCount +
      nextHearingLocationExceptionsDetails.ExceptionsCount +
      offencesMatchedExceptionsDetails.ExceptionsCount
    : 0

  return [
    {
      name: "Defendant",
      exceptionsCount: defendantExceptionsCount,
      exceptionsResolved: asnExceptionDetails.ExceptionsResolved
    },
    {
      name: "Hearing",
      exceptionsCount: 0,
      exceptionsResolved: false
    },
    {
      name: "Case",
      exceptionsCount: 0,
      exceptionsResolved: false
    },
    {
      name: "Offences",
      exceptionsCount: offencesExceptionsCount,
      exceptionsResolved: offencesExceptionsResolved
    },
    {
      name: "Notes",
      exceptionsCount: 0,
      exceptionsResolved: false
    }
  ]
}

export {
  getAsnExceptionDetails,
  getNextHearingDateExceptionsDetails,
  getNextHearingLocationExceptionsDetails,
  getOffencesMatchedExceptionsDetails,
  getTabDetails
}
