import { TableRow } from "components/Table"
import ColumnHeading from "features/CourtCaseFilters/ColumnHeading"
import ColumnOrderIcons from "features/CourtCaseFilters/ColumnOrderIcons"
import { useRouter } from "next/router"
import type { QueryOrder } from "types/CaseListQueryParams"
import { HeaderButton, HeaderCell } from "./AuditCaseListTableHeader.styles"

interface CourtCaseListTableHeaderProps {
  order: QueryOrder
}

export const AuditCaseListTableHeader = ({ order }: CourtCaseListTableHeaderProps) => {
  const router = useRouter()
  const { query } = router
  const orderByParams = (orderBy: string) => `?${new URLSearchParams({ ...query, orderBy, order })}`
  const className = "govuk-table__header table-column-header-cell govuk-body-s"
  const handleHeaderClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, columnName: string) => {
    const target = event.target as HTMLElement
    const headerId = target.closest("button")?.id
    if (headerId) {
      const headerElement = document.getElementById(headerId)
      if (headerElement) {
        headerElement.focus()
      }
    }

    router.push(orderByParams(columnName))
  }

  const ariaSort = (columnName: string) =>
    query.orderBy === columnName ? (query.order === "asc" ? "ascending" : "descending") : "none"

  const ariaLabel = (columnName: string): string => {
    const isSorted = query.orderBy === columnName
    const direction = ariaSort(columnName)
    const readableColumnName = columnName.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())
    return isSorted
      ? `${readableColumnName} column, sorted ${direction}, click to change sort order`
      : `${readableColumnName} column, sortable, click to sort ascending`
  }

  return (
    <TableRow>
      <HeaderCell className={className} style={{ width: "178px" }}>
        <HeaderButton
          className={"table-column-header-button"}
          id="defendant-name-sort"
          aria-live="polite"
          aria-sort={ariaSort("defendantName")}
          aria-label={ariaLabel("defendantName")}
          onClick={(event) => handleHeaderClick(event, "defendantName")}
        >
          {"Defendant name"}
          <ColumnOrderIcons columnName={"defendantName"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className}>
        <HeaderButton
          className={"table-column-header-button"}
          id="asn-sort"
          aria-live="polite"
          aria-sort={ariaSort("asn")}
          aria-label={ariaLabel("asn")}
          onClick={(event) => handleHeaderClick(event, "asn")}
        >
          {"ASN"}
          <ColumnOrderIcons columnName={"asn"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className}>
        <HeaderButton
          className={"table-column-header-button"}
          id="ptiurn-sort"
          aria-live="polite"
          aria-sort={ariaSort("ptiurn")}
          aria-label={ariaLabel("ptiurn")}
          onClick={(event) => handleHeaderClick(event, "ptiurn")}
        >
          {"PTIURN"}
          <ColumnOrderIcons columnName={"ptiurn"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className}>
        <HeaderButton
          className={"table-column-header-button"}
          id="court-name-sort"
          aria-live="polite"
          aria-sort={ariaSort("courtName")}
          aria-label={ariaLabel("courtName")}
          onClick={(event) => handleHeaderClick(event, "courtName")}
        >
          {"Court name"}
          <ColumnOrderIcons columnName={"courtName"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className} style={{ width: "115px" }}>
        <HeaderButton
          className={"table-column-header-button"}
          id="court-date-sort"
          aria-live="polite"
          aria-sort={ariaSort("courtDate")}
          aria-label={ariaLabel("courtDate")}
          onClick={(event) => handleHeaderClick(event, "courtDate")}
        >
          {"Court date"}
          <ColumnOrderIcons columnName={"courtDate"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className}>
        <ColumnHeading aria-sort="none">{"Case reference"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={className} style={{ width: "115px" }}>
        <HeaderButton
          className={"table-column-header-button"}
          id="received-date-sort"
          aria-live="polite"
          aria-sort={ariaSort("messageReceivedTimestamp")}
          aria-label={ariaLabel("messageReceivedTimestamp")}
          onClick={(event) => handleHeaderClick(event, "messageReceivedTimestamp")}
        >
          {"Received date"}
          <ColumnOrderIcons
            columnName={"messageReceivedTimestamp"}
            currentOrder={query.order}
            orderBy={query.orderBy}
          />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className} style={{ width: "115px" }}>
        <HeaderButton
          className={"table-column-header-button"}
          id="resolved-date-sort"
          aria-live="polite"
          aria-sort={ariaSort("resolutionTimestamp")}
          aria-label={ariaLabel("resolutionTimestamp")}
          onClick={(event) => handleHeaderClick(event, "resolutionTimestamp")}
        >
          {"Resolved date"}
          <ColumnOrderIcons columnName={"resolutionTimestamp"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className}>
        <ColumnHeading aria-sort="none">{"Notes"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={className}>
        <ColumnHeading aria-sort="none">{"Resolution action"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={className}>
        <ColumnHeading aria-sort="none">{"Quality status"}</ColumnHeading>
      </HeaderCell>
    </TableRow>
  )
}
