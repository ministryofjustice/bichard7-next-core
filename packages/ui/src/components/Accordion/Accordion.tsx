import { useState } from "react"
import {
  AccordionButton,
  AccordionContent,
  AccordionHeader,
  AccordionHeading,
  AccordionToggle
} from "./Accordion.styles"

type Props = {
  id: string
  heading: string
  children: React.ReactNode
}

const Accordion = ({ id, heading, children }: Props) => {
  const [isContentVisible, setIsContentVisible] = useState(false)

  const toggleContentVisibility = () => setIsContentVisible((previousValue) => !previousValue)

  return (
    <div id={id} className="govuk-accordion__section b7-accordion">
      <AccordionHeader className="govuk-accordion__section-header">
        <AccordionHeading className="govuk-accordion__section-heading">
          <AccordionButton
            type="button"
            aria-controls={`${id}-content`}
            className="govuk-accordion__section-button b7-accordion__button"
            aria-expanded={isContentVisible}
            aria-label={heading}
            onClick={toggleContentVisibility}
          >
            <AccordionToggle className="govuk-accordion__section-toggle">
              <span className="govuk-accordion__section-toggle-focus">
                <span
                  className={`govuk-accordion-nav__chevron ${!isContentVisible ? "govuk-accordion-nav__chevron--down" : ""}`}
                ></span>
                <span className="govuk-accordion__section-toggle-text">{heading}</span>
              </span>
            </AccordionToggle>
          </AccordionButton>
        </AccordionHeading>
      </AccordionHeader>
      {isContentVisible && (
        <AccordionContent id={`${id}-content`} className="accordion__content">
          {children}
        </AccordionContent>
      )}
    </div>
  )
}

export default Accordion
