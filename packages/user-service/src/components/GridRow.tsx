import { ReactNode } from "react"
import useCustomStyles from "styles/useCustomStyles"

interface Props {
  children: ReactNode
}

const GridRow = ({ children }: Props) => {
  const classes = useCustomStyles()

  return <div className={`${classes["top-padding"]} govuk-grid-row`}>{children}</div>
}

export default GridRow
