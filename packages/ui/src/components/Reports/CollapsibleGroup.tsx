import { TotalColumnConfig } from "@/types/reports/Config"
import React, { useState } from "react"
import { AccordionToggle, HeaderWrapper } from "./CollapsibleGroup.styles"
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

  const headerId = `${indexedKey}-header`
  const contentId = `${indexedKey}-content`

  const expandAccordion = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <section key={headerId} aria-labelledby={headerId} id={indexedKey}>
      <HeaderWrapper
        className="govuk-summary-card__title-wrapper"
        onClick={() => expandAccordion()}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        $clickable={hasChildren}
      >
        <h3 id={headerId} className="govuk-heading-m">
          {groupName}

          <Totals totals={totals} totalsConfig={totalsConfig ?? []} />
        </h3>
        {hasChildren && (
          <AccordionToggle>
            <span className={`govuk-accordion-nav__chevron ${accordion.chevron} chevron`}></span>
            <span>{accordion.text}</span>
          </AccordionToggle>
        )}
      </HeaderWrapper>
      {isExpanded && (
        <div id={contentId} className="govuk-summary-card__content">
          <dl className="govuk-summary-list">{children}</dl>
        </div>
      )}
    </section>
  )
}

export default CollapsibleGroup
