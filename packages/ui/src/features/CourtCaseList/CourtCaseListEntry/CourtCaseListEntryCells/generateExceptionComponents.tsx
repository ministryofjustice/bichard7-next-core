import { ParsedUrlQuery } from "querystring"
import { type CourtCaseListEntryRowCells } from "types/CourtCaseListEntryRowCells"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { canUserUnlockCase } from "utils/formatReasons/canUserUnlockCase"
import { displayExceptionReasons } from "utils/formatReasons/exceptions/displayExceptionReasonCell"
import { ReasonCodes, ReasonCodeTitle } from "utils/formatReasons/reasonCodes"
import { unlockCaseWithReasonPath } from "utils/formatReasons/unlockCaseWithReasonPath"
import { ExceptionsLockTag, ExceptionsReasonCell } from "../ExceptionsColumns"
import { ReactNode } from "react"
import Permission from "@moj-bichard7/common/types/Permission"

export const generateExceptionComponents = (
  user: DisplayFullUser,
  courtCase: DisplayPartialCourtCase,
  query: ParsedUrlQuery,
  basePath: string,
  exceptionHasBeenRecentlyUnlocked: boolean,
  formattedReasonCodes: ReasonCodes,
  allocateTag: ReactNode
): CourtCaseListEntryRowCells | undefined => {
  const displayExceptionReasonsResult = displayExceptionReasons(user, courtCase, formattedReasonCodes, query.state)

  if (!displayExceptionReasonsResult) {
    return
  }

  const { hasExceptionReasonCodes, filteredExceptions, exceptions } = displayExceptionReasonsResult
  const { errorId, errorLockedByUsername, errorLockedByUserFullName } = courtCase

  let tagToDisplay: ReactNode | undefined

  if (errorLockedByUsername || errorLockedByUserFullName) {
    tagToDisplay = (
      <ExceptionsLockTag
        errorLockedByUsername={errorLockedByUsername}
        errorLockedByFullName={errorLockedByUserFullName}
        canUnlockCase={canUserUnlockCase(user, errorLockedByUsername)}
        unlockPath={unlockCaseWithReasonPath(ReasonCodeTitle.Exceptions, errorId, query, basePath)}
        exceptionsHaveBeenRecentlyUnlocked={exceptionHasBeenRecentlyUnlocked}
      />
    )
  } else if (user.hasAccessTo[Permission.CanAllocate]) {
    tagToDisplay = allocateTag
  }

  return {
    ReasonCell: <ExceptionsReasonCell exceptionCounts={hasExceptionReasonCodes ? filteredExceptions : exceptions} />,
    LockTag: tagToDisplay
  }
}
