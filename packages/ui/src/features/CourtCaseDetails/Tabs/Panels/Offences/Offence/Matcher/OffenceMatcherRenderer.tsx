import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import OffenceMatcherRow from "./Rows/OffenceMatcherRow"
import OffenceMatchingBadgeRow from "./Rows/OffenceMatchingBadgeRow"

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
}: OffenceMatcherRenderProps): React.ReactNode => {
  const { courtCase } = useCourtCase()
  const currentUser = useCurrentUser()

  const userCanMatchOffence =
    courtCase.errorLockedByUsername === currentUser?.username && courtCase.errorStatus === "Unresolved"

  return (
    <>
      {offenceMatchingException && userCanMatchOffence ? (
        <OffenceMatcherRow offenceIndex={offenceIndex} isCaseLockedToCurrentUser={isCaseLockedToCurrentUser} />
      ) : (
        <OffenceMatchingBadgeRow offenceIndex={offenceIndex} offenceReasonSequence={offenceReasonSequence} />
      )}
    </>
  )
}

export default OffenceMatcherRenderer
