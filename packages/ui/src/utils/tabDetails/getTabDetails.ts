import type { Amendments } from "types/Amendments"
import type { Exception } from "types/exceptions"
import getNumberOfIneditableOffenceExceptions from "../exceptions/getNumberOfOffenceExceptions"
import hasNextHearingDateExceptions from "../exceptions/hasNextHearingDateExceptions"
import hasNextHearingLocationException from "../exceptions/hasNextHearingLocationException"
import hasOffenceMatchingExceptions from "../offenceMatcher/hasOffenceMatchingExceptions"
import getAsnExceptionDetails from "./getAsnExceptionDetails"
import getNextHearingDateExceptionsDetails from "./getNextHearingDateExceptionsDetails"
import getNextHearingLocationExceptionsDetails from "./getNextHearingLocationExceptionsDetails"
import getOffencesMatchedExceptionsDetails from "./getOffencesMatchedExceptionsDetails"

export type TabDetails = {
  name: "Defendant" | "Hearing" | "Case" | "Offences" | "Notes"
  exceptionsCount: number
  exceptionsResolved: boolean
}

export type ExceptionDetails = {
  ExceptionsCount: number
  ExceptionsResolved: boolean
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

  const ineditableOffenceExceptions = getNumberOfIneditableOffenceExceptions(exceptions)

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

  offencesExceptionsResolved &&= ineditableOffenceExceptions === 0

  const defendantExceptionsCount = exceptionsEnabled ? asnExceptionDetails.ExceptionsCount : 0
  const offencesExceptionsCount = exceptionsEnabled
    ? nextHearingDateExceptionsDetails.ExceptionsCount +
      nextHearingLocationExceptionsDetails.ExceptionsCount +
      offencesMatchedExceptionsDetails.ExceptionsCount +
      ineditableOffenceExceptions
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

export default getTabDetails
