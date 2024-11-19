import type CaseDetailsTab from "types/CaseDetailsTab"

import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { getTabDetails } from "utils/getTabDetails"

import { CourtCaseDetailsSingleTab } from "./CourtCaseDetailsSingleTab"
import { StyledNav } from "./CourtCaseDetailsTabs.styles"

interface CourtCaseDetailsTabsProps {
  activeTab: CaseDetailsTab
  onTabClick: (tab: CaseDetailsTab) => void
  width: string
}

export const CourtCaseDetailsTabs = ({ activeTab, onTabClick, width }: CourtCaseDetailsTabsProps) => {
  const { amendments, courtCase, savedAmendments } = useCourtCase()
  const currentUser = useCurrentUser()
  const exceptionsEnabled = currentUser.featureFlags?.exceptionsEnabled

  const tabDetails = getTabDetails(courtCase.aho.Exceptions, amendments, savedAmendments, exceptionsEnabled)

  return (
    <StyledNav aria-label="Sub navigation" className={`moj-sub-navigation nav`} width={width}>
      <ul className="moj-sub-navigation__list">
        {tabDetails.map((tab) => {
          return (
            <CourtCaseDetailsSingleTab
              isActive={tab.name === activeTab}
              key={tab.name}
              onClick={onTabClick}
              tab={tab}
            />
          )
        })}
      </ul>
    </StyledNav>
  )
}
