import { ParsedUrlQuery } from "querystring"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { canUserUnlockCase } from "utils/formatReasons/canUserUnlockCase"
import { displayExceptionReasons } from "utils/formatReasons/exceptions/displayExceptionReasonCell"
import { ReasonCodes, ReasonCodeTitle } from "utils/formatReasons/reasonCodes"
import { unlockCaseWithReasonPath } from "utils/formatReasons/unlockCaseWithReasonPath"
import { type CourtCaseListEntryRowCells } from "../CourtCaseListEntry"
import { ExceptionsLockTag, ExceptionsReasonCell } from "../ExceptionsColumns"

export const generateExceptionComponents = (
  user: DisplayFullUser,
  courtCase: DisplayPartialCourtCase,
  query: ParsedUrlQuery,
  basePath: string,
  exceptionHasBeenRecentlyUnlocked: boolean,
  formattedReasonCodes: ReasonCodes
): CourtCaseListEntryRowCells | undefined => {
  const displayExceptionReasonsResult = displayExceptionReasons(user, courtCase, formattedReasonCodes, query.state)

  if (!displayExceptionReasonsResult) {
    return
  }

  const { hasExceptionReasonCodes, filteredExceptions, exceptions } = displayExceptionReasonsResult
  const { errorId, errorLockedByUsername, errorLockedByUserFullName } = courtCase

  return {
    ReasonCell: <ExceptionsReasonCell exceptionCounts={hasExceptionReasonCodes ? filteredExceptions : exceptions} />,
    LockTag: (
      <ExceptionsLockTag
        errorLockedByUsername={errorLockedByUsername}
        errorLockedByFullName={errorLockedByUserFullName}
        canUnlockCase={canUserUnlockCase(user, errorLockedByUsername)}
        unlockPath={unlockCaseWithReasonPath(ReasonCodeTitle.Exceptions, errorId, query, basePath)}
        exceptionsHaveBeenRecentlyUnlocked={exceptionHasBeenRecentlyUnlocked}
      />
    )
  }
}
