import Permission from "@moj-bichard7/common/types/Permission"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { KeyboardEvent, SyntheticEvent, useState } from "react"
import type NavigationHandler from "types/NavigationHandler"

import useRefreshCsrfToken from "hooks/useRefreshCsrfToken"
import ExceptionsList from "./ExceptionsList"
import PncDetails from "./PncDetails/PncDetails"
import { SidebarContainer } from "./Sidebar.styles"
import TriggersList from "./TriggersList"

enum SidebarTab {
  Exceptions = 1, // makes .filter(Number) work
  Triggers = 2,
  Pnc = 3
}

interface Props {
  onNavigate: NavigationHandler
  canResolveAndSubmit: boolean
  stopLeavingFn: (newValue: boolean) => void
}

const Sidebar = ({ onNavigate, canResolveAndSubmit, stopLeavingFn }: Props) => {
  const currentUser = useCurrentUser()
  const { courtCase } = useCourtCase()

  const permissions: { [tabId: number]: boolean } = {
    [SidebarTab.Exceptions]: currentUser.hasAccessTo[Permission.Exceptions],
    [SidebarTab.Triggers]: currentUser.hasAccessTo[Permission.Triggers]
  }

  const accessibleTabs = Object.entries(permissions)
    .map(([tabId, tabIsAccessible]) => tabIsAccessible && Number(tabId))
    .filter(Number)

  let defaultTab = SidebarTab.Pnc
  if (accessibleTabs.includes(SidebarTab.Triggers) && courtCase.triggerCount > 0) {
    defaultTab = SidebarTab.Triggers
  } else if (accessibleTabs.includes(SidebarTab.Exceptions)) {
    defaultTab = SidebarTab.Exceptions
  }

  const [selectedTab, setSelectedTab] = useState(defaultTab)

  useRefreshCsrfToken({ dependency: selectedTab })

  const handleTabClicked = (event: SyntheticEvent, selectedTab: SidebarTab) => {
    event.preventDefault()
    setSelectedTab(selectedTab)
  }

  const handleOnKeyDown = (e: KeyboardEvent<HTMLAnchorElement>, selectedTab: SidebarTab) => {
    if (
      (selectedTab === SidebarTab.Triggers && e.key === "ArrowRight") ||
      (selectedTab === SidebarTab.Pnc && e.key === "ArrowLeft")
    ) {
      setSelectedTab(SidebarTab.Exceptions)
      window.document.getElementById("exceptions-tab")?.focus()
    } else if (selectedTab === SidebarTab.Exceptions && e.key === "ArrowLeft") {
      setSelectedTab(SidebarTab.Triggers)
      window.document.getElementById("triggers-tab")?.focus()
    } else if (selectedTab === SidebarTab.Exceptions && e.key === "ArrowRight") {
      setSelectedTab(SidebarTab.Pnc)
      window.document.getElementById("pnc-details-tab")?.focus()
    }
  }

  return (
    <SidebarContainer className={`side-bar case-details-sidebar`}>
      <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.CaseDetailsSidebar]}>
        <div className="govuk-tabs">
          <ul className="govuk-tabs__list" role="tablist">
            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Triggers)}>
              <li
                className={`tab govuk-tabs__list-item ${selectedTab === SidebarTab.Triggers ? "govuk-tabs__list-item--selected" : ""}`}
                role="presentation"
              >
                <a
                  id={"triggers-tab"}
                  className="govuk-tabs__tab govuk-heading-s"
                  href="#triggers"
                  onClick={(e) => handleTabClicked(e, SidebarTab.Triggers)}
                  role="tab"
                  aria-controls="triggers"
                  aria-selected={selectedTab == SidebarTab.Triggers}
                  tabIndex={selectedTab == SidebarTab.Triggers ? 0 : -1}
                  onKeyDown={(e) => handleOnKeyDown(e, selectedTab)}
                >
                  {"Triggers"}
                </a>
              </li>
            </ConditionalRender>

            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Exceptions)}>
              <li
                className={`tab govuk-tabs__list-item ${selectedTab === SidebarTab.Exceptions ? "govuk-tabs__list-item--selected" : ""}`}
                role="presentation"
              >
                <a
                  id={"exceptions-tab"}
                  className="govuk-tabs__tab govuk-heading-s"
                  href="#exceptions"
                  onClick={(e) => handleTabClicked(e, SidebarTab.Exceptions)}
                  role="tab"
                  aria-controls="exceptions"
                  aria-selected={selectedTab == SidebarTab.Exceptions}
                  tabIndex={selectedTab == SidebarTab.Exceptions ? 0 : -1}
                  onKeyDown={(e) => handleOnKeyDown(e, selectedTab)}
                >
                  {"Exceptions"}
                </a>
              </li>
            </ConditionalRender>

            <li
              className={`tab govuk-tabs__list-item ${selectedTab === SidebarTab.Pnc ? "govuk-tabs__list-item--selected" : ""}`}
              role="presentation"
            >
              <a
                id={"pnc-details-tab"}
                className="govuk-tabs__tab govuk-heading-s"
                href="#pnc-details"
                onClick={(e) => handleTabClicked(e, SidebarTab.Pnc)}
                role="tab"
                aria-controls="pnc-details"
                aria-selected={selectedTab == SidebarTab.Pnc}
                tabIndex={selectedTab == SidebarTab.Pnc ? 0 : -1}
                onKeyDown={(e) => handleOnKeyDown(e, selectedTab)}
              >
                {"PNC Details"}
              </a>
            </li>
          </ul>

          <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Triggers)}>
            <section
              className={`govuk-tabs__panel moj-tab-panel-triggers tab-panel-triggers ${selectedTab === SidebarTab.Triggers ? "" : "govuk-tabs__panel--hidden"}`}
              id="triggers"
              role="tabpanel"
            >
              <TriggersList onNavigate={onNavigate} />
            </section>
          </ConditionalRender>

          <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Exceptions)}>
            <section
              className={`govuk-tabs__panel moj-tab-panel-exceptions ${selectedTab === SidebarTab.Exceptions ? "" : "govuk-tabs__panel--hidden"}`}
              id="exceptions"
              role="tabpanel"
            >
              <ExceptionsList
                onNavigate={onNavigate}
                canResolveAndSubmit={canResolveAndSubmit}
                stopLeavingFn={stopLeavingFn}
              />
            </section>
          </ConditionalRender>

          <section
            className={`govuk-tabs__panel moj-tab-panel-pnc-details ${selectedTab === SidebarTab.Pnc ? "" : "govuk-tabs__panel--hidden"}`}
            id="pnc-details"
            role="tabpanel"
          >
            <PncDetails />
          </section>
        </div>
      </ConditionalRender>
    </SidebarContainer>
  )
}

export default Sidebar
