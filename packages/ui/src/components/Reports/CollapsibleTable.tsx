import { TotalColumnConfig } from "@/types/reports/Config"
import { useState } from "react"
import { AccordionToggle, HeaderWrapper } from "./CollapsibleTable.styles"
import { Totals } from "./Totals"

interface CollapsibleTableProps {
  tableName: string
  children: React.ReactNode
  totalsConfig?: TotalColumnConfig[]
  totals?: Record<string, unknown>
  indexedKey: string
}

const CollapsibleTable = ({ tableName, children, totalsConfig, totals, indexedKey }: CollapsibleTableProps) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const accordion = isExpanded
    ? { chevron: "govuk-accordion-nav__chevron--up", text: "Hide" }
    : { chevron: "govuk-accordion-nav__chevron--down", text: "Show" }

  const contentId = `${indexedKey}-content`

  return (
    <>
      <HeaderWrapper
        className="govuk-summary-card__title-wrapper"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        $clickable={true}
      >
        <h3 id={`${indexedKey}-header`} className="govuk-heading-m">
          {tableName}
          <Totals totals={totals} totalsConfig={totalsConfig} />
        </h3>
        <AccordionToggle>
          <span className={`govuk-accordion-nav__chevron ${accordion.chevron} chevron`}></span>
          <span>{accordion.text}</span>
        </AccordionToggle>
      </HeaderWrapper>
      {isExpanded && (
        <div id={contentId} className="govuk-summary-card__content">
          <dl className="govuk-summary-list">{children}</dl>
        </div>
      )}
    </>
  )
}

export default CollapsibleTable
