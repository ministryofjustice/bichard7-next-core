import { useAnnouncer } from "@/hooks/useAnnouncer"
import { useSortOrder } from "@/hooks/useSortOrder"
import { RefreshButton } from "components/Buttons/RefreshButton"
import { Table, TableHead } from "components/Table"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import type { QueryOrder } from "types/CaseListQueryParams"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import CourtCaseListEntry from "./CourtCaseListEntry/CourtCaseListEntry"
import { CourtCaseListTableHeader } from "./CourtCaseListTableHeader"

interface Props {
  courtCases: DisplayPartialCourtCase[]
  order?: QueryOrder
  displayAuditQuality: boolean
  courtDateReceivedDateMismatch: boolean
}

const CourtCaseList: React.FC<Props> = ({
  courtCases,
  order = "asc",
  displayAuditQuality,
  courtDateReceivedDateMismatch
}: Props) => {
  const { query } = useRouter()
  const { announce, announcerRef } = useAnnouncer()
  const sortMessage = useSortOrder()

  const recentlyUnlockedExceptionId = query.unlockException
  const recentlyUnlockedTriggerId = query.unlockTrigger

  const queryString = Object.entries(query)
    .reduce((acc, [key, value]) => {
      if (key !== "unlockException" && key !== "unlockTrigger") {
        acc.push(`${key}=${value}`)
      }

      return acc
    }, new Array<string>())
    .join("&")

  useEffect(() => {
    if (sortMessage) {
      announce(sortMessage)
    }
  }, [sortMessage, announce])

  return courtCases.length === 0 ? (
    <div>
      <p className="govuk-body govuk-!-margin-top-4">{"There are no court cases to show"}</p>
      <RefreshButton location="top" />
    </div>
  ) : (
    <>
      <div aria-live="polite" aria-atomic="true" ref={announcerRef} className="govuk-visually-hidden"></div>
      <Table className="cases-list">
        <caption>
          <span className="govuk-visually-hidden">{"Column headers with buttons are sortable."}</span>
        </caption>
        <TableHead>
          <CourtCaseListTableHeader
            order={order}
            displayAuditQuality={displayAuditQuality}
            courtDateReceivedDateMismatch={courtDateReceivedDateMismatch}
          />
        </TableHead>
        {courtCases.map((courtCase) => (
          <CourtCaseListEntry
            courtCase={courtCase}
            exceptionHasBeenRecentlyUnlocked={courtCase.errorId.toString() === recentlyUnlockedExceptionId}
            triggerHasBeenRecentlyUnlocked={courtCase.errorId.toString() === recentlyUnlockedTriggerId}
            key={`court-case-${courtCase.errorId}`}
            previousPath={queryString}
            displayAuditQuality={displayAuditQuality}
            courtDateReceivedDateMismatch={courtDateReceivedDateMismatch}
          />
        ))}
      </Table>
    </>
  )
}

export default CourtCaseList
