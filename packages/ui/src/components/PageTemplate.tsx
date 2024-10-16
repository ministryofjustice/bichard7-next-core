import { ReactNode } from "react"
import { GovukWidthContainer } from "./PageTemplate.styles"

interface Props {
  children: ReactNode
}

const PageTemplate = ({ children }: Props) => {
  return (
    <GovukWidthContainer className={"govuk-width-container"}>
      <main id="main-content" role="main">
        {children}
      </main>
    </GovukWidthContainer>
  )
}

export default PageTemplate
