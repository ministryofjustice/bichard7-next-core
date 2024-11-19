import { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { Exception } from "types/exceptions"
import getExceptionMessage from "utils/offenceMatcher/getExceptionMessage"
import getOffenceMatchingException from "utils/offenceMatcher/getOffenceMatchingException"
import isEnabled from "utils/offenceMatcher/isEnabled"
import offenceMatchingExceptions from "utils/offenceMatcher/offenceMatchingExceptions"

import LegacySequencingRenderer from "./LegacySequencingRenderer"
import OffenceMatcherRenderer from "./OffenceMatcherRenderer"

type OffenceMatchingProps = {
  exceptions: Exception[]
  isCaseLockedToCurrentUser: boolean
  isCaseUnresolved: boolean
  offence: Offence
  offenceIndex: number
}

export const OffenceMatching = ({
  exceptions,
  isCaseLockedToCurrentUser,
  isCaseUnresolved,
  offence,
  offenceIndex
}: OffenceMatchingProps) => {
  const { courtCase } = useCourtCase()
  const currentUser = useCurrentUser()

  const offenceReasonSequence = offence.CriminalProsecutionReference.OffenceReasonSequence
  const offenceMatchingException = isCaseUnresolved && getOffenceMatchingException(exceptions, offenceIndex)
  const offenceMatchingExceptionMessage = getExceptionMessage(courtCase, offenceIndex)

  const displayOffenceMatcher =
    isEnabled(currentUser) && exceptions.some((e) => offenceMatchingExceptions.offenceNotMatched.includes(e.code))

  return (
    <>
      {displayOffenceMatcher ? (
        <OffenceMatcherRenderer
          isCaseLockedToCurrentUser={isCaseLockedToCurrentUser}
          offenceIndex={offenceIndex}
          offenceMatchingException={!!offenceMatchingException}
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
