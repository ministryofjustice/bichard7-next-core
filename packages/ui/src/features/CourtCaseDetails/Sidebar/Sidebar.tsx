import { useState, useCallback } from "react"
import Permission from "@moj-bichard7/common/types/Permission"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import type NavigationHandler from "types/NavigationHandler"

import useRefreshCsrfToken from "hooks/useRefreshCsrfToken"
import ExceptionsList from "./ExceptionsList"
import PncDetails from "./PncDetails/PncDetails"
import { SidebarContainer } from "./Sidebar.styles"
import TriggersList from "./TriggersList"
import { Tabs, TabHeaders, TabHeader, TabPanel } from "../../../components/Tabs"

const SidebarTab = {
  Exceptions: "exceptions",
  Triggers: "triggers",
  Pnc: "pnc-details"
}

interface Props {
  onNavigate: NavigationHandler
  canResolveAndSubmit: boolean
  stopLeavingFn: (newValue: boolean) => void
}

const Sidebar = ({ onNavigate, canResolveAndSubmit, stopLeavingFn }: Props) => {
  const currentUser = useCurrentUser()
  const { courtCase } = useCourtCase()

  let defaultTab = SidebarTab.Pnc
  if (currentUser.hasAccessTo[Permission.Triggers] && courtCase.triggerCount > 0) {
    defaultTab = SidebarTab.Triggers
  } else if (currentUser.hasAccessTo[Permission.Exceptions]) {
    defaultTab = SidebarTab.Exceptions
  }

  const [activeTab, setActiveTab] = useState(defaultTab)
  const onTabChanged = useCallback((tab: string) => setActiveTab(tab), [setActiveTab])

  useRefreshCsrfToken({ dependency: activeTab })

  return (
    <SidebarContainer className="side-bar case-details-sidebar">
      <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.CaseDetailsSidebar]}>
        <Tabs defaultValue={defaultTab} onTabChanged={onTabChanged}>
          <TabHeaders>
            <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Triggers]}>
              <TabHeader value={SidebarTab.Triggers}>{"Triggers"}</TabHeader>
            </ConditionalRender>
            <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Exceptions]}>
              <TabHeader value={SidebarTab.Exceptions}>{"Exceptions"}</TabHeader>
            </ConditionalRender>
            <TabHeader value={SidebarTab.Pnc}>{"PNC Details"}</TabHeader>
          </TabHeaders>
          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Triggers]}>
            <TabPanel value={SidebarTab.Triggers}>
              <TriggersList onNavigate={onNavigate} />
            </TabPanel>
          </ConditionalRender>
          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Exceptions]}>
            <TabPanel value={SidebarTab.Exceptions}>
              <ExceptionsList
                onNavigate={onNavigate}
                canResolveAndSubmit={canResolveAndSubmit}
                stopLeavingFn={stopLeavingFn}
              />
            </TabPanel>
          </ConditionalRender>
          <TabPanel value={SidebarTab.Pnc}>
            <PncDetails />
          </TabPanel>
        </Tabs>
      </ConditionalRender>
    </SidebarContainer>
  )
}

export default Sidebar
