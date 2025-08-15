import { ResolutionStatus } from "@moj-bichard7/common/types/ApiCaseQuery"
import { useCurrentUser } from "context/CurrentUserContext"
import { useRouter } from "next/router"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { formatReasonCodes } from "utils/formatReasons/reasonCodes"
import getResolutionStatus from "../../../utils/getResolutionStatus"
import { CaseDetailsRow } from "./CaseDetailsRow/CaseDetailsRow"
import { generateExceptionComponents } from "./CourtCaseListEntryCells/generateExceptionComponents"
import { generateTriggerComponents } from "./CourtCaseListEntryCells/generateTriggerComponents"
import { ExtraReasonRow } from "./ExtraReasonRow"

interface Props {
  courtCase: DisplayPartialCourtCase
  exceptionHasBeenRecentlyUnlocked: boolean
  triggerHasBeenRecentlyUnlocked: boolean
  previousPath: string | null
}

const CourtCaseListEntry: React.FC<Props> = ({
  courtCase,
  exceptionHasBeenRecentlyUnlocked,
  triggerHasBeenRecentlyUnlocked,
  previousPath
}: Props) => {
  const { basePath, query } = useRouter()
  const currentUser = useCurrentUser()

  const formattedReasonCodes = formatReasonCodes(query.reasonCodes)

  const exceptionsCells = generateExceptionComponents(
    currentUser,
    courtCase,
    query,
    basePath,
    exceptionHasBeenRecentlyUnlocked,
    formattedReasonCodes
  )

  const triggerCells = generateTriggerComponents(
    currentUser,
    courtCase,
    query,
    basePath,
    triggerHasBeenRecentlyUnlocked,
    formattedReasonCodes
  )

  const reasonCell = exceptionsCells?.ReasonCell ?? triggerCells?.ReasonCell
  const extraReasonCell = exceptionsCells?.ReasonCell ? triggerCells?.ReasonCell : undefined
  const resolutionStatus = getResolutionStatus(courtCase)
  const renderExtraReasons = resolutionStatus !== ResolutionStatus.Unresolved || extraReasonCell

  return (
    <tbody className="govuk-table__body caseListEntry">
      <CaseDetailsRow
        courtCase={courtCase}
        reasonCell={reasonCell}
        lockTag={exceptionsCells?.LockTag ?? triggerCells?.LockTag}
        previousPath={previousPath}
      />
      {renderExtraReasons && (
        <ExtraReasonRow
          resolutionStatus={resolutionStatus}
          reasonCell={extraReasonCell}
          lockTag={triggerCells?.LockTag}
        />
      )}
    </tbody>
  )
}

export default CourtCaseListEntry
