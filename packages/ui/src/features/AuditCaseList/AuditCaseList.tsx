import type { AuditCaseDto } from "@moj-bichard7/common/types/AuditCase"

import { RefreshButton } from "components/Buttons/RefreshButton"
import { Table, TableHead } from "components/Table"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import type { QueryOrder } from "types/CaseListQueryParams"
import { AuditCaseListTableHeader } from "./AuditCaseListTableHeader"
import { AuditCaseRow } from "./AuditCaseRow"

interface Props {
  auditId: number
  cases: AuditCaseDto[]
  order?: QueryOrder
}

const AuditCaseList: React.FC<Props> = ({ auditId, cases, order = "asc" }: Props) => {
  const { query, events } = useRouter()
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      if (announcerRef.current) {
        const orderBy = query.orderBy as string
        const order = query.order as QueryOrder
        announcerRef.current.textContent = `Sorted by ${orderBy}, ${order}`
      }
    }
    events.on("routeChangeComplete", handleRouteChangeComplete)
    return () => {
      events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [query.orderBy, query.order, events])

  if (cases.length === 0) {
    return (
      <div>
        <p className="govuk-body govuk-!-margin-top-4">{"There are no court cases to show"}</p>
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
        {cases.map((c) => (
          <AuditCaseRow auditId={auditId} courtCase={c} key={`audit-case-${c.errorId}`} />
        ))}
      </Table>
    </>
  )
}

export default AuditCaseList
