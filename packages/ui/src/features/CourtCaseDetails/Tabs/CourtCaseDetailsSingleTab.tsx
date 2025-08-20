import type { CaseDetailsTab } from "types/CaseDetailsTab"

import { useCourtCase } from "context/CourtCaseContext"
import { useRouter } from "next/router"
import { CHECKMARK_ICON_URL } from "utils/icons"
import type { TabDetails } from "utils/tabDetails/getTabDetails"
import { updateTabLink } from "../../../utils/updateTabLink"
import { CheckmarkIcon } from "./CourtCaseDetailsSingleTab.styles"

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

  const router = useRouter()
  const newPath = updateTabLink(router, tab.name)

  return (
    <li className="moj-sub-navigation__item">
      <a
        id={`${tab.name.toLowerCase()}-tab`}
        className="moj-sub-navigation__link"
        aria-current={isActive ? "page" : undefined}
        href={router.basePath + newPath}
        onClick={(e) => {
          router.replace(newPath, newPath, { shallow: true })
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
