import Permission from "@moj-bichard7/common/types/Permission"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { SyntheticEvent, useState } from "react"
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

  return (
    <SidebarContainer className={`side-bar case-details-sidebar`}>
      <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.CaseDetailsSidebar]}>
        <div className="govuk-tabs">
          <ul className="govuk-tabs__list">
            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Triggers)}>
              <li
                id={"triggers-tab"}
                className={`tab govuk-tabs__list-item ${selectedTab === SidebarTab.Triggers ? "govuk-tabs__list-item--selected" : ""}`}
              >
                <a
                  className="govuk-tabs__tab"
                  href="#triggers-tab"
                  onClick={(e) => handleTabClicked(e, SidebarTab.Triggers)}
                >
                  {"Triggers"}
                </a>
              </li>
            </ConditionalRender>

            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Exceptions)}>
              <li
                id={"exceptions-tab"}
                className={`tab govuk-tabs__list-item ${selectedTab === SidebarTab.Exceptions ? "govuk-tabs__list-item--selected" : ""}`}
              >
                <a
                  className="govuk-tabs__tab"
                  href="#exceptions-tab"
                  onClick={(e) => handleTabClicked(e, SidebarTab.Exceptions)}
                >
                  {"Exceptions"}
                </a>
              </li>
            </ConditionalRender>

            <li
              id={"pnc-details-tab"}
              className={`tab govuk-tabs__list-item ${selectedTab === SidebarTab.Pnc ? "govuk-tabs__list-item--selected" : ""}`}
            >
              <a
                className="govuk-tabs__tab"
                href="#pnc-details-tab"
                onClick={(e) => handleTabClicked(e, SidebarTab.Pnc)}
              >
                {"PNC Details"}
              </a>
            </li>
          </ul>

          <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Triggers)}>
            <div
              className={`govuk-tabs__panel moj-tab-panel-triggers tab-panel-triggers ${selectedTab === SidebarTab.Triggers ? "" : "govuk-tabs__panel--hidden"}`}
              id="triggers"
            >
              <TriggersList onNavigate={onNavigate} />
            </div>
          </ConditionalRender>

          <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Exceptions)}>
            <div
              className={`govuk-tabs__panel moj-tab-panel-exceptions ${selectedTab === SidebarTab.Exceptions ? "" : "govuk-tabs__panel--hidden"}`}
              id="exceptions"
            >
              <ExceptionsList
                onNavigate={onNavigate}
                canResolveAndSubmit={canResolveAndSubmit}
                stopLeavingFn={stopLeavingFn}
              />
            </div>
          </ConditionalRender>

          <div
            className={`govuk-tabs__panel moj-tab-panel-pnc-details ${selectedTab === SidebarTab.Pnc ? "" : "govuk-tabs__panel--hidden"}`}
            id="pnc-details"
          >
            <PncDetails />
          </div>
        </div>
      </ConditionalRender>
    </SidebarContainer>
  )
}

export default Sidebar
