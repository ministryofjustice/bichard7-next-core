import { useCourtCase } from "context/CourtCaseContext"
import type CaseDetailsTab from "types/CaseDetailsTab"
import getTabDetails from "utils/tabDetails/getTabDetails"
import { CourtCaseDetailsSingleTab } from "./CourtCaseDetailsSingleTab"
import { Tabs } from "./CourtCaseDetailsTabs.styles"

interface CourtCaseDetailsTabsProps {
  activeTab: CaseDetailsTab
  onTabClick: (tab: CaseDetailsTab) => void
}

export const CourtCaseDetailsTabs = ({ activeTab, onTabClick }: CourtCaseDetailsTabsProps) => {
  const { courtCase, amendments, savedAmendments } = useCourtCase()

  const tabDetails = getTabDetails(courtCase.aho.Exceptions, amendments, savedAmendments)

  return (
    <Tabs className="govuk-grid-column-two-thirds moj-sub-navigation nav" aria-label="Sub navigation">
      <ul className="moj-sub-navigation__list">
        {tabDetails.map((tab) => {
          return (
            <CourtCaseDetailsSingleTab
              tab={tab}
              isActive={tab.name === activeTab}
              key={tab.name}
              onClick={onTabClick}
            />
          )
        })}
      </ul>
    </Tabs>
  )
}
