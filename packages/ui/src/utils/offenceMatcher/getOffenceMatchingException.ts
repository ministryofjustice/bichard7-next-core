import errorPaths from "@moj-bichard7-developers/bichard7-next-core/core/lib/exceptions/errorPaths"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { isEqual } from "lodash"
import { Exception } from "types/exceptions"
import { ExceptionBadgeType } from "../exceptions/exceptionBadgeType"

const getOffenceReasonSequencePath = (offenceIndex: number) => errorPaths.offence(offenceIndex).reasonSequence
const offenceMatchingExceptions = {
  noOffencesMatched: [ExceptionCode.HO100304, ExceptionCode.HO100328, ExceptionCode.HO100507],
  offenceNotMatched: [
    ExceptionCode.HO100203,
    ExceptionCode.HO100228,
    ExceptionCode.HO100310,
    ExceptionCode.HO100311,
    ExceptionCode.HO100312,
    ExceptionCode.HO100320,
    ExceptionCode.HO100329,
    ExceptionCode.HO100332,
    ExceptionCode.HO100333
  ]
}

type GetOffenceMatchingExceptionResult =
  | {
      code: ExceptionCode
      badge: ExceptionBadgeType.AddedByCourt | ExceptionBadgeType.Unmatched
    }
  | undefined

const getOffenceMatchingExceptions = (exceptions: Exception[]): Exception[] => {
  return exceptions.filter((exception) => offenceMatchingExceptions.offenceNotMatched.includes(exception.code))
}

const getOffenceMatchingException = (
  exceptions: Exception[],
  offenceIndex: number
): GetOffenceMatchingExceptionResult => {
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
    code: offenceMatchingException.code,
    badge:
      offenceMatchingException.code === ExceptionCode.HO100507
        ? ExceptionBadgeType.AddedByCourt
        : ExceptionBadgeType.Unmatched
  }
}

export { getOffenceMatchingException, getOffenceMatchingExceptions }
export type { GetOffenceMatchingExceptionResult }
