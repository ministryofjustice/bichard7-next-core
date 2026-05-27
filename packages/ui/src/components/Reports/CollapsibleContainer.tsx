import { TotalColumnConfig } from "@/types/reports/Config"
import React, { JSX, useState } from "react"
import { AccordionToggle } from "../Card/Card.styles"
import { HeaderButton } from "./CollapsibleContainer.styles"
import { Totals } from "./Totals"

interface CollapsibleContainerProps {
  headingName: string
  children: React.ReactNode
  totalsConfig?: TotalColumnConfig[]
  totals?: Record<string, unknown>
  indexedKey: string
  headerType: "h3" | "h4"
}

const CollapsibleContainer = ({
  headingName,
  children,
  totalsConfig,
  totals,
  indexedKey,
  headerType
}: CollapsibleContainerProps) => {
  const childrenCount = React.Children.count(children)
  const hasChildren = childrenCount > 0

  const [isExpanded, setIsExpanded] = useState(hasChildren)
  const accordion = isExpanded
    ? { chevron: "govuk-accordion-nav__chevron--up", text: "Hide" }
    : { chevron: "govuk-accordion-nav__chevron--down", text: "Show" }

  const sectionId = `${indexedKey}-section`
  const headerId = `${indexedKey}-header`
  const contentId = `${indexedKey}-content`

  const HeaderTag = headerType as keyof JSX.IntrinsicElements

  const toggleAccordion = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <section aria-labelledby={headerId} id={sectionId}>
      <HeaderButton
        className="govuk-summary-card__title-wrapper"
        onClick={() => toggleAccordion()}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        data-testid="accordion-header-wrapper"
        $clickable={hasChildren}
        $headerType={headerType}
      >
        <HeaderTag id={headerId} className="govuk-heading-m">
          {headingName}

          <Totals totals={totals} totalsConfig={totalsConfig ?? []} flat={false} />
        </HeaderTag>
        {hasChildren && (
          <AccordionToggle data-testid="accordion-toggle">
            <span className={`govuk-accordion-nav__chevron ${accordion.chevron} chevron`}></span>
            <span>{accordion.text}</span>
          </AccordionToggle>
        )}
      </HeaderButton>
      <div
        id={contentId}
        className="govuk-summary-card__content"
        data-testid="accordion-content"
        aria-labelledby={headerId}
      >
        {isExpanded && <dl className="govuk-summary-list">{children}</dl>}
      </div>
    </section>
  )
}

export default CollapsibleContainer
