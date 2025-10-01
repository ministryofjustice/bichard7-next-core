import { ReactNode } from "react"

type ColumnWidth = "full" | "one-half" | "one-third" | "two-thirds" | "one-quarter" | "three-quarters"

interface Props {
  children?: ReactNode
  width: ColumnWidth
}

const GridColumn = ({ children, width }: Props) => <div className={`govuk-grid-column-${width}`}>{children}</div>

export default GridColumn
