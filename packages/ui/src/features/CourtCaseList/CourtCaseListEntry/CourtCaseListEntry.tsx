import Permission from "@moj-bichard7/common/types/Permission"
import { useCurrentUser } from "context/CurrentUserContext"
import { useRouter } from "next/router"
import { encode } from "querystring"
import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"

import getResolutionStatus from "../../../utils/getResolutionStatus"
import { CaseDetailsRow } from "./CaseDetailsRow/CaseDetailsRow"
import { ExceptionsLockTag, ExceptionsReasonCell } from "./ExceptionsColumns"
import { ExtraReasonRow } from "./ExtraReasonRow"
import { TriggersLockTag, TriggersReasonCell } from "./TriggersColumns"

interface Props {
  courtCase: DisplayPartialCourtCase
  exceptionHasBeenRecentlyUnlocked: boolean
  previousPath: null | string
  triggerHasBeenRecentlyUnlocked: boolean
}

const CourtCaseListEntry: React.FC<Props> = ({
  courtCase,
  exceptionHasBeenRecentlyUnlocked,
  previousPath,
  triggerHasBeenRecentlyUnlocked
}: Props) => {
  const {
    errorId,
    errorLockedByUserFullName,
    errorLockedByUsername,
    errorReport,
    errorStatus,
    triggerLockedByUserFullName,
    triggerLockedByUsername,
    triggers
  } = courtCase

  const { basePath, query } = useRouter()
  const searchParams = new URLSearchParams(encode(query))
  const currentUser = useCurrentUser()
  const reasonCodes =
    typeof query.reasonCodes === "string"
      ? query.reasonCodes
          .split(" ")
          .map((reasonCode) => getLongTriggerCode(reasonCode))
          .join(" ")
      : query.reasonCodes?.map((reasonCode) => getLongTriggerCode(reasonCode))

  const unlockCaseWithReasonPath = (reason: "Exception" | "Trigger", caseId: string) => {
    deleteQueryParamsByName(["unlockException", "unlockTrigger"], searchParams)

    searchParams.append(`unlock${reason}`, caseId)
    return `${basePath}/?${searchParams}`
  }

  const canUnlockCase = (lockedUsername: string): boolean => {
    return currentUser.hasAccessTo[Permission.UnlockOtherUsersCases] || currentUser.username === lockedUsername
  }

  const hasTriggers = triggers.length > 0
  const hasExceptions = !!errorReport

  let exceptionsLockTag, exceptionsReasonCell, triggersLockTag, triggersReasonCell
  if (hasExceptions && currentUser.hasAccessTo[Permission.Exceptions]) {
    const displayExceptions = (query.state === "Resolved" && errorStatus === "Resolved") || errorStatus === "Unresolved"
    const exceptions = groupErrorsFromReport(errorReport)
    const filteredExceptions = Object.fromEntries(
      Object.entries(exceptions).filter(([error]) => reasonCodes?.includes(error))
    )
    exceptionsReasonCell = displayExceptions && (
      <ExceptionsReasonCell exceptionCounts={reasonCodes ? filteredExceptions : exceptions} />
    )
    exceptionsLockTag = displayExceptions && (
      <ExceptionsLockTag
        canUnlockCase={!!errorLockedByUsername && canUnlockCase(errorLockedByUsername)}
        errorLockedByFullName={errorLockedByUserFullName}
        errorLockedByUsername={errorLockedByUsername}
        exceptionsHaveBeenRecentlyUnlocked={exceptionHasBeenRecentlyUnlocked}
        unlockPath={unlockCaseWithReasonPath("Exception", `${errorId}`)}
      />
    )
  }
  if (hasTriggers && currentUser.hasAccessTo[Permission.Triggers]) {
    triggersReasonCell = (
      <TriggersReasonCell
        triggers={reasonCodes ? triggers.filter((trigger) => reasonCodes?.includes(trigger.triggerCode)) : triggers}
      />
    )
    triggersLockTag = (
      <TriggersLockTag
        canUnlockCase={!!triggerLockedByUsername && canUnlockCase(triggerLockedByUsername)}
        triggersHaveBeenRecentlyUnlocked={triggerHasBeenRecentlyUnlocked}
        triggersLockedByFullName={triggerLockedByUserFullName}
        triggersLockedByUsername={triggerLockedByUsername}
        unlockPath={unlockCaseWithReasonPath("Trigger", `${errorId}`)}
      />
    )
  }

  return (
    <tbody>
      <CaseDetailsRow
        courtCase={courtCase}
        lockTag={exceptionsLockTag || triggersLockTag}
        previousPath={previousPath}
        reasonCell={exceptionsReasonCell || triggersReasonCell}
        resolutionStatus={getResolutionStatus(courtCase)}
      />
      {exceptionsLockTag && triggersLockTag && triggersReasonCell && (
        <ExtraReasonRow
          isLocked={!!triggerLockedByUsername}
          lockTag={triggersLockTag}
          reasonCell={triggersReasonCell}
        />
      )}
    </tbody>
  )
}

export default CourtCaseListEntry
