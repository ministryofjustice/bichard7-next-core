import { ParsedUrlQuery } from "querystring"
import { type CourtCaseListEntryRowCells } from "types/CourtCaseListEntryRowCells"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { canUserUnlockCase } from "utils/formatReasons/canUserUnlockCase"
import { ReasonCodes, ReasonCodeTitle } from "utils/formatReasons/reasonCodes"
import { displayTriggerReasonCell } from "utils/formatReasons/triggers/displayTriggerReasonCell"
import { unlockCaseWithReasonPath } from "utils/formatReasons/unlockCaseWithReasonPath"
import { TriggersLockTag, TriggersReasonCell } from "../TriggersColumns"

export const generateTriggerComponents = (
  user: DisplayFullUser,
  courtCase: DisplayPartialCourtCase,
  query: ParsedUrlQuery,
  basePath: string,
  triggerHasBeenRecentlyUnlocked: boolean,
  formattedReasonCodes: ReasonCodes
): CourtCaseListEntryRowCells | undefined => {
  const displayTriggerReasonResult = displayTriggerReasonCell(user, courtCase, formattedReasonCodes)

  if (!displayTriggerReasonResult) {
    return
  }

  const { hasTriggerReasonCodes, filteredTriggers, triggers } = displayTriggerReasonResult
  const { errorId, triggerLockedByUserFullName, triggerLockedByUsername } = courtCase

  return {
    ReasonCell: <TriggersReasonCell triggers={hasTriggerReasonCodes ? filteredTriggers : triggers} />,
    LockTag: (
      <TriggersLockTag
        triggersLockedByUsername={triggerLockedByUsername}
        triggersLockedByFullName={triggerLockedByUserFullName}
        triggersHaveBeenRecentlyUnlocked={triggerHasBeenRecentlyUnlocked}
        canUnlockCase={canUserUnlockCase(user, triggerLockedByUsername)}
        unlockPath={unlockCaseWithReasonPath(ReasonCodeTitle.Triggers, errorId, query, basePath)}
      />
    )
  }
}
