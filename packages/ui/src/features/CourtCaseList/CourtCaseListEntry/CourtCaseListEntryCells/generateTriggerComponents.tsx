import { ParsedUrlQuery } from "querystring"
import { type CourtCaseListEntryRowCells } from "types/CourtCaseListEntryRowCells"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { canUserUnlockCase } from "utils/formatReasons/canUserUnlockCase"
import { ReasonCodes, ReasonCodeTitle } from "utils/formatReasons/reasonCodes"
import { displayTriggerReasonCell } from "utils/formatReasons/triggers/displayTriggerReasonCell"
import { unlockCaseWithReasonPath } from "utils/formatReasons/unlockCaseWithReasonPath"
import { TriggersLockTag, TriggersReasonCell } from "../TriggersColumns"
import { ReactNode } from "react"
import Permission from "@moj-bichard7/common/types/Permission"
import CaseUnlockedTag from "../../tags/CaseUnlockedTag"

export const generateTriggerComponents = (
  user: DisplayFullUser,
  courtCase: DisplayPartialCourtCase,
  query: ParsedUrlQuery,
  basePath: string,
  triggerHasBeenRecentlyUnlocked: boolean,
  formattedReasonCodes: ReasonCodes,
  allocateTag: ReactNode
): CourtCaseListEntryRowCells | undefined => {
  const { triggers } = courtCase

  if (triggers.length === 0) {
    return
  }

  const displayTriggerReasonResult = displayTriggerReasonCell(user, triggers, formattedReasonCodes)

  if (!displayTriggerReasonResult) {
    return
  }

  const { hasTriggerReasonCodes, filteredTriggers } = displayTriggerReasonResult
  const { errorId, triggerLockedByUserFullName, triggerLockedByUsername } = courtCase

  let tagToDisplay: ReactNode | undefined

  if (triggerLockedByUserFullName || triggerLockedByUsername) {
    tagToDisplay = (
      <TriggersLockTag
        triggersLockedByUsername={triggerLockedByUsername}
        triggersLockedByFullName={triggerLockedByUserFullName}
        canUnlockCase={canUserUnlockCase(user, triggerLockedByUsername)}
        unlockPath={unlockCaseWithReasonPath(ReasonCodeTitle.Triggers, errorId, query, basePath)}
      />
    )
  } else if (user.hasAccessTo[Permission.CanAllocate]) {
    tagToDisplay = allocateTag
  } else {
    tagToDisplay = <CaseUnlockedTag isCaseUnlocked={triggerHasBeenRecentlyUnlocked} />
  }

  return {
    ReasonCell: <TriggersReasonCell triggers={hasTriggerReasonCodes ? filteredTriggers : triggers} />,
    LockTag: tagToDisplay
  }
}
