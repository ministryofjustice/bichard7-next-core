import Permission from "@moj-bichard7/common/types/Permission"
import { useCurrentUser } from "context/CurrentUserContext"
import { useRouter } from "next/router"
import { encode, ParsedUrlQuery } from "querystring"
import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"

import { ResolutionStatus } from "@moj-bichard7/common/types/ApiCaseQuery"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
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
  triggerHasBeenRecentlyUnlocked: boolean
  previousPath: string | null
}

type ReasonCodes = Record<"Exceptions" | "Triggers", string[]>

type ExceptionsCells = {
  exceptionsReasonCell: React.ReactNode
  exceptionsLockTag: React.ReactNode
}

type TriggersCells = {
  triggersReasonCell: React.ReactNode
  triggersLockTag: React.ReactNode
}

const canUserUnlockCase = (user: DisplayFullUser, lockedUsername: string): boolean => {
  return user.hasAccessTo[Permission.UnlockOtherUsersCases] || user.username === lockedUsername
}

const unlockCaseWithReasonPath = (
  reason: "Trigger" | "Exception",
  caseId: number,
  query: ParsedUrlQuery,
  basePath: string
) => {
  const searchParams = new URLSearchParams(encode(query))
  deleteQueryParamsByName(["unlockException", "unlockTrigger"], searchParams)

  searchParams.append(`unlock${reason}`, String(caseId))
  return `${basePath}/?${searchParams}`
}

const formatReasonCodes = (reasonCodes: string | string[] | undefined): ReasonCodes => {
  const formattedReasonCodes: ReasonCodes = { Exceptions: [], Triggers: [] }

  if (!reasonCodes) {
    return formattedReasonCodes
  }

  let reasonCodesArray: string[] = []

  if (Array.isArray(reasonCodes)) {
    reasonCodesArray = reasonCodes.map((reasonCode) => getLongTriggerCode(reasonCode) ?? reasonCode)
  } else {
    reasonCodesArray = reasonCodes.split(" ").map((reasonCode) => getLongTriggerCode(reasonCode) ?? reasonCode)
  }

  formattedReasonCodes.Exceptions = reasonCodesArray.filter((rc) => rc.startsWith("HO"))
  formattedReasonCodes.Triggers = reasonCodesArray.filter((rc) => !rc.startsWith("HO"))

  return formattedReasonCodes
}

const generateExceptionComponents = (
  user: DisplayFullUser,
  courtCase: DisplayPartialCourtCase,
  query: ParsedUrlQuery,
  basePath: string,
  exceptionHasBeenRecentlyUnlocked: boolean,
  formattedReasonCodes: ReasonCodes
): ExceptionsCells | undefined => {
  if (!user.hasAccessTo[Permission.Exceptions]) {
    return undefined
  }

  const { errorStatus, errorReport, errorLockedByUserFullName, errorLockedByUsername, errorId } = courtCase

  const displayExceptions =
    (query.state === ResolutionStatus.Resolved && errorStatus === ResolutionStatus.Resolved) ||
    errorStatus === ResolutionStatus.Unresolved

  if (!displayExceptions) {
    return undefined
  }

  const exceptionReasonCodes = formattedReasonCodes.Exceptions
  const triggerReasonCodes = formattedReasonCodes.Triggers

  if (exceptionReasonCodes.length === 0 && triggerReasonCodes.length > 0) {
    return undefined
  }

  const exceptions = groupErrorsFromReport(errorReport)
  const filteredExceptions = Object.fromEntries(
    Object.entries(exceptions).filter(([error]) => exceptionReasonCodes.includes(error))
  )

  return {
    exceptionsReasonCell: (
      <ExceptionsReasonCell exceptionCounts={exceptionReasonCodes.length > 0 ? filteredExceptions : exceptions} />
    ),
    exceptionsLockTag: (
      <ExceptionsLockTag
        errorLockedByUsername={errorLockedByUsername}
        errorLockedByFullName={errorLockedByUserFullName}
        canUnlockCase={!!errorLockedByUsername && canUserUnlockCase(user, errorLockedByUsername)}
        unlockPath={unlockCaseWithReasonPath("Exception", errorId, query, basePath)}
        exceptionsHaveBeenRecentlyUnlocked={exceptionHasBeenRecentlyUnlocked}
      />
    )
  }
}

const generateTriggerComponents = (
  user: DisplayFullUser,
  courtCase: DisplayPartialCourtCase,
  query: ParsedUrlQuery,
  basePath: string,
  triggerHasBeenRecentlyUnlocked: boolean,
  formattedReasonCodes: ReasonCodes
): TriggersCells | undefined => {
  if (!user.hasAccessTo[Permission.Triggers]) {
    return undefined
  }

  const { errorId, triggers, triggerLockedByUserFullName, triggerLockedByUsername } = courtCase

  const exceptionReasonCodes = formattedReasonCodes.Exceptions
  const triggerReasonCodes = formattedReasonCodes.Triggers

  if (triggerReasonCodes.length === 0 && exceptionReasonCodes.length > 0) {
    return undefined
  }

  return {
    triggersReasonCell: (
      <TriggersReasonCell
        triggers={
          triggerReasonCodes.length > 0
            ? triggers.filter((trigger) => triggerReasonCodes.includes(trigger.triggerCode))
            : triggers
        }
      />
    ),
    triggersLockTag: (
      <TriggersLockTag
        triggersLockedByUsername={triggerLockedByUsername}
        triggersLockedByFullName={triggerLockedByUserFullName}
        triggersHaveBeenRecentlyUnlocked={triggerHasBeenRecentlyUnlocked}
        canUnlockCase={!!triggerLockedByUsername && canUserUnlockCase(user, triggerLockedByUsername)}
        unlockPath={unlockCaseWithReasonPath("Trigger", errorId, query, basePath)}
      />
    )
  }
}

const CourtCaseListEntry: React.FC<Props> = ({
  courtCase,
  exceptionHasBeenRecentlyUnlocked,
  triggerHasBeenRecentlyUnlocked,
  previousPath
}: Props) => {
  const { errorReport, triggerLockedByUsername, triggers } = courtCase

  const { basePath, query } = useRouter()
  const currentUser = useCurrentUser()

  const hasTriggers = triggers.length > 0
  const hasExceptions = !!errorReport

  const formattedReasonCodes = formatReasonCodes(query.reasonCodes)

  const exceptionsCells = hasExceptions
    ? generateExceptionComponents(
        currentUser,
        courtCase,
        query,
        basePath,
        exceptionHasBeenRecentlyUnlocked,
        formattedReasonCodes
      )
    : undefined

  const triggerCells = hasTriggers
    ? generateTriggerComponents(
        currentUser,
        courtCase,
        query,
        basePath,
        triggerHasBeenRecentlyUnlocked,
        formattedReasonCodes
      )
    : undefined

  const reasonCell = exceptionsCells?.exceptionsReasonCell || triggerCells?.triggersReasonCell
  const extraReasonCell = exceptionsCells?.exceptionsReasonCell ? triggerCells?.triggersReasonCell : undefined
  const resolutionStatus = getResolutionStatus(courtCase)
  const renderExtraReasons = resolutionStatus !== ResolutionStatus.Unresolved || extraReasonCell

  return (
    <tbody className="govuk-table__body caseListEntry">
      <CaseDetailsRow
        courtCase={courtCase}
        reasonCell={reasonCell}
        lockTag={exceptionsCells?.exceptionsLockTag || triggerCells?.triggersLockTag}
        previousPath={previousPath}
      />
      {renderExtraReasons && (
        <ExtraReasonRow
          isLocked={!!triggerLockedByUsername}
          resolutionStatus={resolutionStatus}
          reasonCell={extraReasonCell}
          lockTag={triggerCells?.triggersLockTag}
        />
      )}
    </tbody>
  )
}

export default CourtCaseListEntry
