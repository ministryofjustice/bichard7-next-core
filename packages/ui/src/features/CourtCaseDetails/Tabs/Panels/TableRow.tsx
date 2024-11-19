import { Table } from "govuk-react"

import { StyledHintText, StyledTableRow } from "./TableRow.styles"

interface TableRowProps {
  className?: string
  hintText?: string
  label: string
  value: null | number | React.ReactNode | string | undefined
}

export const TableRow = ({ className, hintText, label, value }: TableRowProps) => {
  const rowClassName = `table-row__${label.replaceAll(/ /g, "-").toLowerCase()}`
  return (
    <StyledTableRow className={`table-row ${rowClassName} row ${className}`}>
      <Table.Cell className="row-label">
        <b>{label}</b>
        {hintText && <StyledHintText className={"hint-text"}>{hintText}</StyledHintText>}
      </Table.Cell>
      <Table.Cell className="row-value">{value}</Table.Cell>
    </StyledTableRow>
  )
}
