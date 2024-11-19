import { useCourtCase } from "context/CourtCaseContext"
import CaseDetailsTab from "types/CaseDetailsTab"
import { TabDetails } from "utils/getTabDetails"
import { CHECKMARK_ICON_URL } from "utils/icons"

import { CheckmarkIcon } from "./CourtCaseDetailsSingleTab.styles"

interface CourtCaseDetailsSingleTabProps {
  isActive: boolean
  onClick: (tab: CaseDetailsTab) => void
  tab: TabDetails
}

export const CourtCaseDetailsSingleTab = ({ isActive, onClick, tab }: CourtCaseDetailsSingleTabProps) => {
  const {
    courtCase: { errorStatus: errorStatus }
  } = useCourtCase()
  const displayExceptionCount: boolean = tab.exceptionsCount > 0 && errorStatus === "Unresolved"

  return (
    <li className="moj-sub-navigation__item">
      <a
        aria-current={isActive ? "page" : undefined}
        className="moj-sub-navigation__link"
        href="/"
        onClick={(e) => {
          e.preventDefault()
          onClick(tab.name)
        }}
      >
        {tab.name} <span />
        {tab.exceptionsResolved ? (
          <CheckmarkIcon
            alt="Checkmark icon"
            className={`checkmark-icon checkmark`}
            height={30}
            key={tab.name}
            src={CHECKMARK_ICON_URL}
            width={30}
          />
        ) : (
          displayExceptionCount && (
            <span className="moj-notification-badge" id="notifications" key={tab.name}>
              {tab.exceptionsCount}
            </span>
          )
        )}
      </a>
    </li>
  )
}
