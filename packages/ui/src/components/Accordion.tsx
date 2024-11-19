import { useState } from "react"

import {
  AccordionButton,
  AccordionContent,
  AccordionHeader,
  AccordionHeading,
  AccordionToggle
} from "./Accordion.styles"

type Props = {
  children: React.ReactNode
  heading: string
  id: string
}

const Accordion = ({ children, heading, id }: Props) => {
  const [isContentVisible, setIsContentVisible] = useState(false)

  const toggleContentVisibility = () => setIsContentVisible((previousValue) => !previousValue)

  return (
    <div className="govuk-accordion__section b7-accordion" id={id}>
      <AccordionHeader className="govuk-accordion__section-header">
        <AccordionHeading className="govuk-accordion__section-heading">
          <AccordionButton
            aria-controls={`${id}-content`}
            aria-expanded={isContentVisible}
            aria-label={heading}
            className="govuk-accordion__section-button b7-accordion__button"
            onClick={toggleContentVisibility}
            type="button"
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
        <AccordionContent className="accordion__content" id={`${id}-content`}>
          {children}
        </AccordionContent>
      )}
    </div>
  )
}

export default Accordion
