import { ColumnContainer, ColumnContent } from "./ColumnHeading.styles"

interface Props {
  children?: React.ReactNode
}

const ColumnHeading: React.FC<Props> = ({ children }) => {
  return (
    <ColumnContainer className={"container"}>
      <ColumnContent className={"content"}>{children}</ColumnContent>
    </ColumnContainer>
  )
}

export default ColumnHeading
