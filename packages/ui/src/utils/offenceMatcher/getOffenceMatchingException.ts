import type { Exception } from "types/exceptions"

import errorPaths from "@moj-bichard7/core/lib/exceptions/errorPaths"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { isEqual } from "lodash"

import { ExceptionBadgeType } from "../exceptions/exceptionBadgeType"
import offenceMatchingExceptions from "./offenceMatchingExceptions"

const getOffenceReasonSequencePath = (offenceIndex: number) => errorPaths.offence(offenceIndex).reasonSequence

type OffenceMatchingException = {
  badge: ExceptionBadgeType.AddedByCourt | ExceptionBadgeType.Unmatched
  code: ExceptionCode
}

const getOffenceMatchingException = (
  exceptions: Exception[],
  offenceIndex: number
): OffenceMatchingException | undefined => {
  const offenceMatchingException = exceptions.find((exception) => {
    const sequencePath = getOffenceReasonSequencePath(offenceIndex)

    const exceptionPath = exception.path.slice(exception.path.indexOf("HearingOutcome"))
    const hearingOutcomePath = sequencePath.slice(sequencePath.indexOf("HearingOutcome"))

    return (
      offenceMatchingExceptions.noOffencesMatched.includes(exception.code) ||
      (offenceMatchingExceptions.offenceNotMatched.includes(exception.code) &&
        isEqual(exceptionPath, hearingOutcomePath))
    )
  })

  if (!offenceMatchingException) {
    return undefined
  }

  return {
    badge:
      offenceMatchingException.code === ExceptionCode.HO100507
        ? ExceptionBadgeType.AddedByCourt
        : ExceptionBadgeType.Unmatched,
    code: offenceMatchingException.code
  }
}

export default getOffenceMatchingException
export type { OffenceMatchingException }
