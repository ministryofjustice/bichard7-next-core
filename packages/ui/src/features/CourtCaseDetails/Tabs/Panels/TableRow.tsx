import { HintTextNoMargin } from "components/HintText"
import { StyledTableRow } from "./TableRow.styles"

interface TableRowProps {
  label: string
  hintText?: string
  value: string | number | null | undefined | React.ReactNode
  className?: string
}

export const TableRow = ({ label, value, hintText, className }: TableRowProps) => {
  const rowClassName = `table-row__${label.replaceAll(/ /g, "-").toLowerCase()}`
  return (
    <StyledTableRow className={`govuk-table__row table-row ${rowClassName} row ${className ?? ""}`}>
      <td className="govuk-table__cell row-label">
        <b>{label}</b>
        {hintText && <HintTextNoMargin className={"hint-text"}>{hintText}</HintTextNoMargin>}
      </td>
      <td className="govuk-table__cell row-value">{value}</td>
    </StyledTableRow>
  )
}
