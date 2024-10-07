import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { Tabs } from "govuk-react"
import { useState } from "react"
import type NavigationHandler from "types/NavigationHandler"
import Permission from "types/Permission"
import ExceptionsList from "./ExceptionsList"
import { SidebarContainer, UnpaddedPanel } from "./Sidebar.styles"
import TriggersList from "./TriggersList"
import PncDetails from "./PncDetails/PncDetails"

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

  return (
    <SidebarContainer className={`side-bar case-details-sidebar`}>
      <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.CaseDetailsSidebar]}>
        <Tabs>
          <Tabs.List>
            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Triggers)}>
              <Tabs.Tab
                id="triggers-tab"
                className={"tab"}
                onClick={() => setSelectedTab(SidebarTab.Triggers)}
                selected={selectedTab === SidebarTab.Triggers}
              >
                {`Triggers`}
              </Tabs.Tab>
            </ConditionalRender>

            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Exceptions)}>
              <Tabs.Tab
                id="exceptions-tab"
                className={"tab"}
                onClick={() => setSelectedTab(SidebarTab.Exceptions)}
                selected={selectedTab === SidebarTab.Exceptions}
              >
                {`Exceptions`}
              </Tabs.Tab>
            </ConditionalRender>

            <Tabs.Tab
              id="pnc-details-tab"
              className={"tab"}
              onClick={() => setSelectedTab(SidebarTab.Pnc)}
              selected={selectedTab === SidebarTab.Pnc}
            >
              {`PNC Details`}
            </Tabs.Tab>
          </Tabs.List>

          <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Triggers)}>
            <Tabs.Panel
              id="triggers"
              selected={selectedTab === SidebarTab.Triggers}
              className={`moj-tab-panel-triggers tab-panel-triggers`}
            >
              <TriggersList onNavigate={onNavigate} />
            </Tabs.Panel>
          </ConditionalRender>

          <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Exceptions)}>
            <Tabs.Panel
              id="exceptions"
              selected={selectedTab === SidebarTab.Exceptions}
              className="moj-tab-panel-exceptions"
            >
              <ExceptionsList
                onNavigate={onNavigate}
                canResolveAndSubmit={canResolveAndSubmit}
                stopLeavingFn={stopLeavingFn}
              />
            </Tabs.Panel>
          </ConditionalRender>

          <UnpaddedPanel
            id="pnc-details"
            selected={selectedTab === SidebarTab.Pnc}
            className="moj-tab-panel-pnc-details"
          >
            <PncDetails />
          </UnpaddedPanel>
        </Tabs>
      </ConditionalRender>
    </SidebarContainer>
  )
}

export default Sidebar
