import { cloneElement, type JSX } from "react"
import KeyValuePair from "types/KeyValuePair"

interface Props {
  component?: JSX.Element
  item: KeyValuePair<string, string>
  field: string
}

const TableColumn = ({ component, item, field }: Props) => {
  return <td className="govuk-table__cell">{component ? cloneElement(component, { item }) : item[field]}</td>
}

export default TableColumn
