import { TotalColumnConfig } from "@/types/reports/Config"
import { useState } from "react"
import { AccordionToggle, HeaderWrapper } from "./CollapsibleTable.styles"
import { Totals } from "./Totals"

interface CollapsibleTableProps {
  tableName: string
  children: React.ReactNode
  totalsConfig?: TotalColumnConfig[]
  totals?: Record<string, unknown>
}

const CollapsibleTable = ({ tableName, children, totalsConfig, totals }: CollapsibleTableProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const accordion = !isCollapsed
    ? { chevron: "govuk-accordion-nav__chevron--up", text: "Hide" }
    : { chevron: "govuk-accordion-nav__chevron--down", text: "Show" }

  return (
    <div className={`govuk-heading-m`}>
      <HeaderWrapper
        className="govuk-summary-card__title-wrapper"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
        aria-controls={tableName}
        $clickable={true}
      >
        <h3 id={"sectionId"} className="govuk-heading-m">
          {tableName}
          <Totals totals={totals} totalsConfig={totalsConfig} />
        </h3>
        <AccordionToggle>
          <span className={`govuk-accordion-nav__chevron ${accordion.chevron} chevron`}></span>
          <span>{accordion.text}</span>
        </AccordionToggle>
      </HeaderWrapper>
      {!isCollapsed && (
        <div id={`${"indexedKey"}`} className="govuk-summary-card__content">
          <dl className="govuk-summary-list">{children}</dl>
        </div>
      )}
    </div>
  )
}

export default CollapsibleTable
