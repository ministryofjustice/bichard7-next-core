import CaseDetailsTab from "types/CaseDetailsTab"
import { TabDetails } from "utils/getTabDetails"
import { CHECKMARK_ICON_URL } from "utils/icons"
import { CheckmarkIcon } from "./CourtCaseDetailsSingleTab.styles"
import { useCourtCase } from "context/CourtCaseContext"

interface CourtCaseDetailsSingleTabProps {
  tab: TabDetails
  isActive: boolean
  onClick: (tab: CaseDetailsTab) => void
}

export const CourtCaseDetailsSingleTab = ({ tab, isActive, onClick }: CourtCaseDetailsSingleTabProps) => {
  const {
    courtCase: { errorStatus: errorStatus }
  } = useCourtCase()
  const displayExceptionCount: boolean = tab.exceptionsCount > 0 && errorStatus === "Unresolved"

  return (
    <li className="moj-sub-navigation__item">
      <a
        className="moj-sub-navigation__link"
        aria-current={isActive ? "page" : undefined}
        href="/"
        onClick={(e) => {
          e.preventDefault()
          onClick(tab.name)
        }}
      >
        {tab.name} <span />
        {tab.exceptionsResolved ? (
          <CheckmarkIcon
            className={`checkmark-icon checkmark`}
            key={tab.name}
            src={CHECKMARK_ICON_URL}
            width={30}
            height={30}
            alt="Checkmark icon"
          />
        ) : (
          displayExceptionCount && (
            <span key={tab.name} id="notifications" className="moj-notification-badge">
              {tab.exceptionsCount}
            </span>
          )
        )}
      </a>
    </li>
  )
}
