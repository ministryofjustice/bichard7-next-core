import ColumnHeading from "features/CourtCaseFilters/ColumnHeading"
import ColumnOrderIcons from "features/CourtCaseFilters/ColumnOrderIcons"
import { useRouter } from "next/router"
import type { QueryOrder } from "types/CaseListQueryParams"
import { HeaderCell, HeaderCellAlt, HeaderLink } from "./CourtCaseListTableHeader.styles"

interface CourtCaseListTableHeaderProps {
  order: QueryOrder
}

export const CourtCaseListTableHeader = ({ order }: CourtCaseListTableHeaderProps) => {
  const { basePath, query } = useRouter()
  const orderByParams = (orderBy: string) => `${basePath}/?${new URLSearchParams({ ...query, orderBy, order })}`
  const className = "govuk-table__header table-column-header-cell govuk-body-s"

  return (
    <tr className="govuk-table__row">
      <HeaderCellAlt className={className}>
        <span className="govuk-visually-hidden">{"Lock status"}</span>
      </HeaderCellAlt>
      <HeaderCell className={className} style={{ width: "178px" }}>
        <HeaderLink
          className={"table-column-header-link"}
          href={orderByParams("defendantName")}
          id="defendant-name-sort"
          aria-live="polite"
          aria-sort={order === "asc" ? "ascending" : "descending"}
        >
          {"Defendant name"}
          <ColumnOrderIcons columnName={"defendantName"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={className} style={{ width: "115px" }}>
        <HeaderLink
          className={"table-column-header-link"}
          href={orderByParams("courtDate")}
          id="court-date-sort"
          aria-live="polite"
          aria-sort={order === "asc" ? "ascending" : "descending"}
        >
          {"Court date"}
          <ColumnOrderIcons columnName={"courtDate"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={className}>
        <HeaderLink
          className={"table-column-header-link"}
          href={orderByParams("courtName")}
          id="court-name-sort"
          aria-live="polite"
          aria-sort={order === "asc" ? "ascending" : "descending"}
        >
          {"Court name"}
          <ColumnOrderIcons columnName={"courtName"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={className}>
        <HeaderLink
          className={"table-column-header-link"}
          href={orderByParams("ptiurn")}
          id="ptiurn-sort"
          aria-live="polite"
          aria-sort={order === "asc" ? "ascending" : "descending"}
        >
          {"PTIURN"}
          <ColumnOrderIcons columnName={"ptiurn"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
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
