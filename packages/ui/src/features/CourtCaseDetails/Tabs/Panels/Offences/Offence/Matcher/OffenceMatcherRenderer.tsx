import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"

import OffenceMatcherTableRow from "./TableRows/OffenceMatcherTableRow"
import OffenceMatchingBadgeTableRow from "./TableRows/OffenceMatchingBadgeTableRow"

interface OffenceMatcherRenderProps {
  isCaseLockedToCurrentUser: boolean
  offenceIndex: number
  offenceMatchingException: boolean
  offenceReasonSequence?: null | string
}

const OffenceMatcherRenderer = ({
  isCaseLockedToCurrentUser,
  offenceIndex,
  offenceMatchingException,
  offenceReasonSequence
}: OffenceMatcherRenderProps): JSX.Element => {
  const { courtCase } = useCourtCase()
  const currentUser = useCurrentUser()

  const userCanMatchOffence =
    courtCase.errorLockedByUsername === currentUser?.username && courtCase.errorStatus === "Unresolved"

  return (
    <>
      {offenceMatchingException && userCanMatchOffence ? (
        <OffenceMatcherTableRow isCaseLockedToCurrentUser={isCaseLockedToCurrentUser} offenceIndex={offenceIndex} />
      ) : (
        <OffenceMatchingBadgeTableRow offenceIndex={offenceIndex} offenceReasonSequence={offenceReasonSequence} />
      )}
    </>
  )
}

export default OffenceMatcherRenderer
