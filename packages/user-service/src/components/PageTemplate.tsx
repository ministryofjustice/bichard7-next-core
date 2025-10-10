import { ReactNode } from "react"
import useCustomStyles from "styles/useCustomStyles"

interface Props {
  children: ReactNode
}

const PageTemplate = ({ children }: Props) => {
  const classes = useCustomStyles()
  return (
    <div className={classes["govuk-width-container"]}>
      <main id="main-content" role="main">
        {children}
      </main>
    </div>
  )
}

export default PageTemplate
