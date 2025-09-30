import { ReactNode } from "react"
import KeyValuePair from "types/KeyValuePair"
import getColumnComponents from "./getColumnComponents"
import TableColumn from "./TableColumn"

export type TableHeader = [string, string]

export type TableHeaders = Array<TableHeader>

type Props = {
  tableHeaders: TableHeaders
  tableTitle?: string
  tableData: KeyValuePair<string, string>[]
  children?: ReactNode
}

export const Table = ({ tableTitle, tableHeaders, tableData, children }: Props) => {
  const columnComponents = getColumnComponents(children)

  return (
    <table className="govuk-table">
      {tableTitle && <caption className="govuk-table__caption govuk-table__caption--m">{tableTitle}</caption>}
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          {tableHeaders.map((header: TableHeader) => (
            <th key={header[0]} scope="col" className="govuk-table__header">
              {header[1]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {tableData.map((row: KeyValuePair<string, string>) => (
          <tr key={Object.values(row).join("")} className="govuk-table__row">
            {tableHeaders.map((header: TableHeader) => {
              const field = header[0]
              return <TableColumn key={field} component={columnComponents[field]} item={row} field={field} />
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
