import { ResolutionStatus } from "@moj-bichard7/common/types/ApiCaseQuery"
import Permission from "@moj-bichard7/common/types/Permission"
import { useCurrentUser } from "context/CurrentUserContext"
import { useRouter } from "next/router"
import { encode, ParsedUrlQuery } from "querystring"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import { canUserUnlockCase } from "utils/formatReasons/canUserUnlockCase"
import { displayExceptionReasons } from "utils/formatReasons/exceptions/displayExceptionReasonCell"
import { formatReasonCodes, ReasonCodes, ReasonCodeTitle } from "utils/formatReasons/reasonCodes"
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

type ExceptionsCells = {
  exceptionsReasonCell: React.ReactNode
  exceptionsLockTag: React.ReactNode
}

type TriggersCells = {
  triggersReasonCell: React.ReactNode
  triggersLockTag: React.ReactNode
}

const unlockCaseWithReasonPath = (reason: ReasonCodeTitle, caseId: number, query: ParsedUrlQuery, basePath: string) => {
  const searchParams = new URLSearchParams(encode(query))
  deleteQueryParamsByName(["unlockException", "unlockTrigger"], searchParams)

  searchParams.append(`unlock${reason}`, String(caseId))
  return `${basePath}/?${searchParams}`
}

const generateExceptionComponents = (
  user: DisplayFullUser,
  courtCase: DisplayPartialCourtCase,
  query: ParsedUrlQuery,
  basePath: string,
  exceptionHasBeenRecentlyUnlocked: boolean,
  formattedReasonCodes: ReasonCodes
): ExceptionsCells | undefined => {
  const displayExceptionReasonsResult = displayExceptionReasons(user, courtCase, query.state, formattedReasonCodes)

  if (!displayExceptionReasonsResult) {
    return
  }

  const { hasExceptionReasonCodes, filteredExceptions, exceptions } = displayExceptionReasonsResult
  const { errorId, errorLockedByUsername, errorLockedByUserFullName } = courtCase

  return {
    exceptionsReasonCell: (
      <ExceptionsReasonCell exceptionCounts={hasExceptionReasonCodes ? filteredExceptions : exceptions} />
    ),
    exceptionsLockTag: (
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
        unlockPath={unlockCaseWithReasonPath(ReasonCodeTitle.Triggers, errorId, query, basePath)}
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
