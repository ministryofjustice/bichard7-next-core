import { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { useCourtCase } from "context/CourtCaseContext"
import { Exception } from "types/exceptions"
import getExceptionMessage from "utils/offenceMatcher/getExceptionMessage"
import getOffenceMatchingException from "utils/offenceMatcher/getOffenceMatchingException"
import offenceMatchingExceptions from "utils/offenceMatcher/offenceMatchingExceptions"
import LegacySequencingRenderer from "./LegacySequencingRenderer"
import OffenceMatcherRenderer from "./OffenceMatcherRenderer"

type OffenceMatchingProps = {
  offenceIndex: number
  offence: Offence
  isCaseUnresolved: boolean
  exceptions: Exception[]
  isCaseLockedToCurrentUser: boolean
}

export const OffenceMatching = ({
  offenceIndex,
  offence,
  isCaseUnresolved,
  exceptions,
  isCaseLockedToCurrentUser
}: OffenceMatchingProps) => {
  const { courtCase } = useCourtCase()

  const offenceReasonSequence = offence.CriminalProsecutionReference.OffenceReasonSequence
  const offenceMatchingException = isCaseUnresolved && getOffenceMatchingException(exceptions, offenceIndex)
  const offenceMatchingExceptionMessage = getExceptionMessage(courtCase, offenceIndex)

  const displayOffenceMatcher = exceptions.some((e) => offenceMatchingExceptions.offenceNotMatched.includes(e.code))

  return (
    <>
      {displayOffenceMatcher ? (
        <OffenceMatcherRenderer
          offenceMatchingException={!!offenceMatchingException}
          offenceIndex={offenceIndex}
          isCaseLockedToCurrentUser={isCaseLockedToCurrentUser}
          offenceReasonSequence={offenceReasonSequence}
        />
      ) : (
        <LegacySequencingRenderer
          offenceMatchingException={offenceMatchingException}
          offenceMatchingExceptionMessage={offenceMatchingExceptionMessage}
          offenceReasonSequence={offenceReasonSequence}
        />
      )}
    </>
  )
}
