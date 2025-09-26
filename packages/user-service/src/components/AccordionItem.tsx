import { ReactNode } from "react"

interface Props {
  children: ReactNode
  dataTest?: string
  heading: string
  id: string
}

const AccordionItem = ({ children, dataTest, heading, id }: Props) => (
  <>
    <div className="govuk-accordion__section" data-test={dataTest}>
      <div className="govuk-accordion__section-header">
        <h2 className="govuk-accordion__section-heading">
          <span className="govuk-accordion__section-button" id={id}>
            {heading}
          </span>
        </h2>
      </div>
      <div className="govuk-accordion__section-content" aria-labelledby={id}>
        {children}
      </div>
    </div>
  </>
)

export default AccordionItem
