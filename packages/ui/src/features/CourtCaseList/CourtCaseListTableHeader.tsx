import ColumnHeading from "features/CourtCaseFilters/ColumnHeading"
import ColumnOrderIcons from "features/CourtCaseFilters/ColumnOrderIcons"
import { useRouter } from "next/router"
import type { QueryOrder } from "types/CaseListQueryParams"
import { HeaderButton, HeaderCell, HeaderCellAlt } from "./CourtCaseListTableHeader.styles"

interface CourtCaseListTableHeaderProps {
  order: QueryOrder
}

export const CourtCaseListTableHeader = ({ order }: CourtCaseListTableHeaderProps) => {
  const router = useRouter()
  const { query } = router
  const orderByParams = (orderBy: string) => `?${new URLSearchParams({ ...query, orderBy, order })}`
  const className = "govuk-table__header table-column-header-cell govuk-body-s"
  const ariaSort = (columnHeader: string) =>
    query.orderBy === columnHeader ? (query.order === "asc" ? "ascending" : "descending") : "none"
  const handleHeaderClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, columnHeader: string) => {
    const target = event.target as HTMLElement
    const headerId = target.closest("button")?.id
    if (headerId) {
      const headerElement = document.getElementById(headerId)
      if (headerElement) {
        headerElement.focus()
      }
    }

    router.push(orderByParams(columnHeader))
  }

  return (
    <tr className="govuk-table__row">
      <HeaderCellAlt className={className}>
        <span className="govuk-visually-hidden">{"Lock status"}</span>
      </HeaderCellAlt>
      <HeaderCell className={className} style={{ width: "178px" }}>
        <HeaderButton
          className={"table-column-header-button"}
          id="defendant-name-sort"
          aria-live="polite"
          aria-sort={ariaSort("defendantName")}
          onClick={(event) => handleHeaderClick(event, "defendantName")}
        >
          {"Defendant name"}
          <ColumnOrderIcons columnName={"defendantName"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className} style={{ width: "115px" }}>
        <HeaderButton
          className={"table-column-header-button"}
          id="court-date-sort"
          aria-live="polite"
          aria-sort={ariaSort("courtDate")}
          onClick={(event) => handleHeaderClick(event, "courtDate")}
        >
          {"Court date"}
          <ColumnOrderIcons columnName={"courtDate"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className}>
        <HeaderButton
          className={"table-column-header-button"}
          id="court-name-sort"
          aria-live="polite"
          aria-sort={ariaSort("courtName")}
          onClick={(event) => handleHeaderClick(event, "courtName")}
        >
          {"Court name"}
          <ColumnOrderIcons columnName={"courtName"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className}>
        <HeaderButton
          className={"table-column-header-button"}
          id="ptiurn-sort"
          aria-live="polite"
          aria-sort={ariaSort("ptiurn")}
          onClick={(event) => handleHeaderClick(event, "ptiurn")}
        >
          {"PTIURN"}
          <ColumnOrderIcons columnName={"ptiurn"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderButton>
      </HeaderCell>
      <HeaderCell className={className}>
        <ColumnHeading aria-sort="none">{"Notes"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={className}>
        <ColumnHeading aria-sort="none">{"Reason"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={className}>
        <ColumnHeading aria-sort="none">{"Locked by"}</ColumnHeading>
      </HeaderCell>
    </tr>
  )
}
