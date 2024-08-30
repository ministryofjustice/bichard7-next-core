import { ReactNode } from "react"
import { ColumnContainer, ColumnContent } from "./ColumnHeading.styles"

interface Props {
  children?: ReactNode
}

const ColumnHeading: React.FC<Props> = ({ children }) => {
  return (
    <ColumnContainer className={"container"}>
      <ColumnContent className={"content"}>{children}</ColumnContent>
    </ColumnContainer>
  )
}

export default ColumnHeading
