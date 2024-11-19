import type NavigationHandler from "types/NavigationHandler"

import Permission from "@moj-bichard7/common/types/Permission"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { Tabs } from "govuk-react"
import { useState } from "react"

import ExceptionsList from "./ExceptionsList"
import PncDetails from "./PncDetails/PncDetails"
import { SidebarContainer, UnpaddedPanel } from "./Sidebar.styles"
import TriggersList from "./TriggersList"

enum SidebarTab {
  Exceptions = 1, // makes .filter(Number) work
  Pnc = 3,
  Triggers = 2
}

interface Props {
  canResolveAndSubmit: boolean
  onNavigate: NavigationHandler
  stopLeavingFn: (newValue: boolean) => void
}

const Sidebar = ({ canResolveAndSubmit, onNavigate, stopLeavingFn }: Props) => {
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

  return (
    <SidebarContainer className={`side-bar case-details-sidebar`}>
      <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.CaseDetailsSidebar]}>
        <Tabs>
          <Tabs.List>
            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Triggers)}>
              <Tabs.Tab
                className={"tab"}
                id="triggers-tab"
                onClick={() => setSelectedTab(SidebarTab.Triggers)}
                selected={selectedTab === SidebarTab.Triggers}
              >
                {`Triggers`}
              </Tabs.Tab>
            </ConditionalRender>

            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Exceptions)}>
              <Tabs.Tab
                className={"tab"}
                id="exceptions-tab"
                onClick={() => setSelectedTab(SidebarTab.Exceptions)}
                selected={selectedTab === SidebarTab.Exceptions}
              >
                {`Exceptions`}
              </Tabs.Tab>
            </ConditionalRender>

            <Tabs.Tab
              className={"tab"}
              id="pnc-details-tab"
              onClick={() => setSelectedTab(SidebarTab.Pnc)}
              selected={selectedTab === SidebarTab.Pnc}
            >
              {`PNC Details`}
            </Tabs.Tab>
          </Tabs.List>

          <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Triggers)}>
            <Tabs.Panel
              className={`moj-tab-panel-triggers tab-panel-triggers`}
              id="triggers"
              selected={selectedTab === SidebarTab.Triggers}
            >
              <TriggersList onNavigate={onNavigate} />
            </Tabs.Panel>
          </ConditionalRender>

          <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Exceptions)}>
            <Tabs.Panel
              className="moj-tab-panel-exceptions"
              id="exceptions"
              selected={selectedTab === SidebarTab.Exceptions}
            >
              <ExceptionsList
                canResolveAndSubmit={canResolveAndSubmit}
                onNavigate={onNavigate}
                stopLeavingFn={stopLeavingFn}
              />
            </Tabs.Panel>
          </ConditionalRender>

          <UnpaddedPanel
            className="moj-tab-panel-pnc-details"
            id="pnc-details"
            selected={selectedTab === SidebarTab.Pnc}
          >
            <PncDetails />
          </UnpaddedPanel>
        </Tabs>
      </ConditionalRender>
    </SidebarContainer>
  )
}

export default Sidebar
