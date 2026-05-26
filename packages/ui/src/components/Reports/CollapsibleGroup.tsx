import { TotalColumnConfig } from "@/types/reports/Config"
import React, { useState } from "react"
import { AccordionToggle } from "../Card/Card.styles"
import { HeaderButton } from "./CollapsibleGroup.styles"
import { Totals } from "./Totals"

interface CollapsibleGroupProps {
  groupName: string
  children: React.ReactNode
  totalsConfig?: TotalColumnConfig[]
  totals?: Record<string, unknown>
  indexedKey: string
}

const CollapsibleGroup = ({ groupName, children, totalsConfig, totals, indexedKey }: CollapsibleGroupProps) => {
  const childrenCount = React.Children.count(children)
  const hasChildren = childrenCount > 0

  const [isExpanded, setIsExpanded] = useState(hasChildren)
  const accordion = isExpanded
    ? { chevron: "govuk-accordion-nav__chevron--up", text: "Hide" }
    : { chevron: "govuk-accordion-nav__chevron--down", text: "Show" }

  const sectionId = `${indexedKey}-section`
  const headerId = `${indexedKey}-header`
  const contentId = `${indexedKey}-content`

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
        $clickable={hasChildren}
        data-testid="accordion-header-wrapper"
      >
        <h3 id={headerId} className="govuk-heading-m">
          {groupName}

          <Totals totals={totals} totalsConfig={totalsConfig ?? []} />
        </h3>
        {hasChildren && (
          <AccordionToggle data-testid="accordion-toggle">
            <span className={`govuk-accordion-nav__chevron ${accordion.chevron} chevron`}></span>
            <span>{accordion.text}</span>
          </AccordionToggle>
        )}
      </HeaderButton>
      {isExpanded && (
        <div
          id={contentId}
          className="govuk-summary-card__content"
          data-testid="accordion-content"
          aria-labelledby={headerId}
        >
          <dl className="govuk-summary-list">{children}</dl>
        </div>
      )}

      <br />
    </section>
  )
}

export default CollapsibleGroup
