import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import OffenceMatcherTableRow from "./TableRows/OffenceMatcherTableRow"
import OffenceMatchingBadgeTableRow from "./TableRows/OffenceMatchingBadgeTableRow"

interface OffenceMatcherRenderProps {
  offenceMatchingException: boolean
  offenceIndex: number
  isCaseLockedToCurrentUser: boolean
  offenceReasonSequence?: string | null
}

const OffenceMatcherRenderer = ({
  offenceMatchingException,
  offenceIndex,
  offenceReasonSequence,
  isCaseLockedToCurrentUser
}: OffenceMatcherRenderProps): JSX.Element => {
  const { courtCase } = useCourtCase()
  const currentUser = useCurrentUser()

  const userCanMatchOffence =
    courtCase.errorLockedByUsername === currentUser?.username && courtCase.errorStatus === "Unresolved"

  return (
    <>
      {offenceMatchingException && userCanMatchOffence ? (
        <OffenceMatcherTableRow offenceIndex={offenceIndex} isCaseLockedToCurrentUser={isCaseLockedToCurrentUser} />
      ) : (
        <OffenceMatchingBadgeTableRow offenceIndex={offenceIndex} offenceReasonSequence={offenceReasonSequence} />
      )}
    </>
  )
}

export default OffenceMatcherRenderer
