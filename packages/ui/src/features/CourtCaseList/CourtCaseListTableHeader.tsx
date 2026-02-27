import ConditionalRender from "components/ConditionalRender"
import { TableRow } from "components/Table"
import ColumnHeading from "features/CourtCaseFilters/ColumnHeading"
import ColumnOrderIcons from "features/CourtCaseFilters/ColumnOrderIcons"
import type { QueryOrder } from "types/CaseListQueryParams"
import { HeaderButton, HeaderCell } from "./CourtCaseListTableHeader.styles"
import { useColumnSorting } from "hooks/useColumnSorting"

interface CourtCaseListTableHeaderProps {
  order: QueryOrder
  displayAuditQuality: boolean
  courtDateReceivedDateMismatch: boolean
}

export const CourtCaseListTableHeader = ({
  order,
  displayAuditQuality,
  courtDateReceivedDateMismatch
}: CourtCaseListTableHeaderProps) => {
  const { query, handleHeaderClick, ariaSort, ariaLabel } = useColumnSorting(order)
  const className = "govuk-table__header table-column-header-cell govuk-body-s"

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
      <ConditionalRender isRendered={courtDateReceivedDateMismatch}>
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
      </ConditionalRender>
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
        <ColumnHeading aria-sort="none">{"Notes"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={className}>
        <ColumnHeading aria-sort="none">{"Reason"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={className}>
        <ColumnHeading aria-sort="none">{"Locked by"}</ColumnHeading>
      </HeaderCell>
      <ConditionalRender isRendered={displayAuditQuality}>
        <HeaderCell className={className}>
          <ColumnHeading aria-sort="none">{"Quality status"}</ColumnHeading>
        </HeaderCell>
      </ConditionalRender>
    </TableRow>
  )
}
