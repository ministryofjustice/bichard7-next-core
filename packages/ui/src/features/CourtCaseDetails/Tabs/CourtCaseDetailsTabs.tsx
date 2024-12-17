import { useCourtCase } from "context/CourtCaseContext"
import type CaseDetailsTab from "types/CaseDetailsTab"
import getTabDetails from "utils/tabDetails/getTabDetails"
import { CourtCaseDetailsSingleTab } from "./CourtCaseDetailsSingleTab"
import { StyledNav } from "./CourtCaseDetailsTabs.styles"

interface CourtCaseDetailsTabsProps {
  activeTab: CaseDetailsTab
  onTabClick: (tab: CaseDetailsTab) => void
  width: string
}

export const CourtCaseDetailsTabs = ({ activeTab, onTabClick, width }: CourtCaseDetailsTabsProps) => {
  const { courtCase, amendments, savedAmendments } = useCourtCase()

  const tabDetails = getTabDetails(courtCase.aho.Exceptions, amendments, savedAmendments)

  return (
    <StyledNav width={width} className={`moj-sub-navigation nav`} aria-label="Sub navigation">
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
    </StyledNav>
  )
}
