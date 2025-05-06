import { AccordionToggle, HeaderWrapper } from "./Card.styles"

interface CardProps {
  heading: string
  isContentVisible: boolean
  children: React.ReactNode
  contentInstanceKey?: string
  toggleContentVisibility?: () => void
}

const Card = ({ heading, contentInstanceKey, isContentVisible, toggleContentVisibility, children }: CardProps) => {
  const contentKey = heading.split(" ").join("-").toLowerCase()
  const indexedKey = contentInstanceKey ?? contentKey
  const accordion = isContentVisible
    ? { chevron: "govuk-accordion-nav__chevron--up", text: "Hide" }
    : { chevron: "govuk-accordion-nav__chevron--down", text: "Show" }

  return (
    <div className={`govuk-summary-card ${contentKey}`}>
      <HeaderWrapper
        className="govuk-summary-card__title-wrapper"
        onClick={toggleContentVisibility}
        aria-expanded={isContentVisible}
        aria-controls={indexedKey}
      >
        <h2
          className={"govuk-summary-card__title"}
          data-testid={indexedKey}
          aria-live={"polite"}
          aria-label={contentKey}
        >
          {heading}
        </h2>
        <AccordionToggle>
          <span className={`govuk-accordion-nav__chevron ${accordion.chevron} chevron`}></span>
          <span>{accordion.text}</span>
        </AccordionToggle>
      </HeaderWrapper>
      {isContentVisible && (
        <div id={`${indexedKey}`} className="govuk-summary-card__content">
          <dl className="govuk-summary-list">{children}</dl>
        </div>
      )}
    </div>
  )
}

export default Card
