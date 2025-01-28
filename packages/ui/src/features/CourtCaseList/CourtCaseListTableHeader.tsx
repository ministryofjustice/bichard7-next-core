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

  return (
    <tr className="govuk-table__row">
      <HeaderCellAlt className={"govuk-table__header table-column-header-cell"} />
      <HeaderCell className={"govuk-table__header table-column-header-cell"} style={{ width: "178px" }}>
        <HeaderLink
          className={"table-column-header-link"}
          href={orderByParams("defendantName")}
          id="defendant-name-sort"
        >
          {"Defendant name"}
          <ColumnOrderIcons columnName={"defendantName"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={"govuk-table__header table-column-header-cell"} style={{ width: "115px" }}>
        <HeaderLink className={"table-column-header-link"} href={orderByParams("courtDate")} id="court-date-sort">
          {"Court date"}
          <ColumnOrderIcons columnName={"courtDate"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={"govuk-table__header table-column-header-cell"}>
        <HeaderLink className={"table-column-header-link"} href={orderByParams("courtName")} id="court-name-sort">
          {"Court name"}
          <ColumnOrderIcons columnName={"courtName"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={"govuk-table__header table-column-header-cell"}>
        <HeaderLink className={"table-column-header-link"} href={orderByParams("ptiurn")} id="ptiurn-sort">
          {"PTIURN"}
          <ColumnOrderIcons columnName={"ptiurn"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={"govuk-table__header table-column-header-cell"}>
        <ColumnHeading>{"Notes"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={"govuk-table__header table-column-header-cell"}>
        <ColumnHeading>{"Reason"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={"govuk-table__header table-column-header-cell"}>
        <ColumnHeading>{"Locked by"}</ColumnHeading>
      </HeaderCell>
    </tr>
  )
}
