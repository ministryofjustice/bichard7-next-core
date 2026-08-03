import type { AuditCaseDto } from "@moj-bichard7/common/types/AuditCase"

import { useAnnouncer } from "@/hooks/useAnnouncer"
import { useSortOrder } from "@/hooks/useSortOrder"
import { RefreshButton } from "components/Buttons/RefreshButton"
import { Table, TableHead } from "components/Table"
import { useEffect } from "react"
import type { QueryOrder } from "types/CaseListQueryParams"
import { AuditCaseListTableHeader } from "./AuditCaseListTableHeader"
import { AuditCaseRow } from "./AuditCaseRow"

interface Props {
  auditId: number
  auditCases: AuditCaseDto[]
  order?: QueryOrder
}

const AuditCaseList: React.FC<Props> = ({ auditId, auditCases, order = "asc" }: Props) => {
  const { announce, announcerRef } = useAnnouncer()
  const sortMessage = useSortOrder()

  useEffect(() => {
    if (sortMessage) {
      announce(sortMessage)
    }
  }, [sortMessage, announce])

  if (auditCases.length === 0) {
    return (
      <div>
        <p className="govuk-body govuk-!-margin-top-4">{"No court cases found for this audit"}</p>
        <RefreshButton location="top" />
      </div>
    )
  }

  return (
    <>
      <div aria-live="polite" aria-atomic="true" ref={announcerRef} className="govuk-visually-hidden"></div>
      <Table className="cases-list">
        <caption>
          <span className="govuk-visually-hidden">{"Column headers with buttons are sortable."}</span>
        </caption>
        <TableHead>
          <AuditCaseListTableHeader order={order} />
        </TableHead>
        {auditCases.map((auditCase) => (
          <AuditCaseRow auditId={auditId} auditCase={auditCase} key={`audit-case-${auditCase.errorId}`} />
        ))}
      </Table>
    </>
  )
}

export default AuditCaseList
