import { RefreshButton } from "components/Buttons/RefreshButton"
import { useRouter } from "next/router"
import type { QueryOrder } from "types/CaseListQueryParams"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import CourtCaseListEntry from "./CourtCaseListEntry/CourtCaseListEntry"
import { CourtCaseListTableHeader } from "./CourtCaseListTableHeader"

interface Props {
  courtCases: DisplayPartialCourtCase[]
  order?: QueryOrder
}

const CourtCaseList: React.FC<Props> = ({ courtCases, order = "asc" }: Props) => {
  const { query } = useRouter()

  const recentlyUnlockedExceptionId = query.unlockException
  const recentlyUnlockedTriggerId = query.unlockTrigger

  const queryString = Object.entries(query)
    .reduce((acc, [key, value]) => {
      if (key === "unlockException" || key === "unlockTrigger") {
        // next
      } else {
        acc.push(`${key}=${value}`)
      }

      return acc
    }, new Array<string>())
    .join("&")

  return courtCases.length === 0 ? (
    <div>
      <p className="govuk-body govuk-!-margin-top-4">{"There are no court cases to show"}</p>
      <RefreshButton location="top" />
    </div>
  ) : (
    <table className="govuk-table cases-list">
      <thead className="govuk-table__head">
        <CourtCaseListTableHeader order={order} />
      </thead>
      {courtCases.map((courtCase) => (
        <CourtCaseListEntry
          courtCase={courtCase}
          exceptionHasBeenRecentlyUnlocked={courtCase.errorId.toString() === recentlyUnlockedExceptionId}
          triggerHasBeenRecentlyUnlocked={courtCase.errorId.toString() === recentlyUnlockedTriggerId}
          key={`court-case-${courtCase.errorId}`}
          previousPath={queryString}
        />
      ))}
    </table>
  )
}

export default CourtCaseList
