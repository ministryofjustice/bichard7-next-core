import type { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"

import LockedTag from "../../components/LockedTag"
import ResolutionStatusTag from "../../components/ResolutionStatusTag"
import { useCourtCase } from "../../context/CourtCaseContext"
import { useCurrentUser } from "../../context/CurrentUserContext"

const LockStatusTag = ({
  isRendered,
  resolutionStatus,
  lockName
}: {
  isRendered: boolean
  resolutionStatus?: ResolutionStatus | null
  lockName: "Triggers" | "Exceptions"
}) => {
  const currentUser = useCurrentUser()
  const { courtCase } = useCourtCase()
  const lockedByUserName =
    lockName === "Exceptions" ? courtCase.errorLockedByUsername : courtCase.triggerLockedByUsername
  const displayLockUserName =
    (lockName === "Exceptions" ? courtCase.errorLockedByUserFullName : courtCase.triggerLockedByUserFullName) || ""

  if (!isRendered) {
    return
  }

  return resolutionStatus && resolutionStatus !== "Unresolved" ? (
    <ResolutionStatusTag itemName={lockName} resolutionStatus={resolutionStatus} />
  ) : (
    <LockedTag
      lockName={lockName}
      lockedBy={currentUser.username === lockedByUserName ? "Locked to you" : displayLockUserName}
    />
  )
}

export default LockStatusTag
