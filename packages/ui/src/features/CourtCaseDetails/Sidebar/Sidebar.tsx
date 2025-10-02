import { useCallback } from "react"
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
import { Tabs, TabHeaders, TabHeader, TabPanel } from "components/Tabs"
import { QualityStatusCard } from "./Audit/QualityStatusCard"

const SidebarTab = {
  Exceptions: "exceptions",
  Triggers: "triggers",
  Pnc: "pnc-details"
}

interface Props {
  onNavigate: NavigationHandler
  canResolveAndSubmit: boolean
  canUseTriggerAndExceptionQualityAuditing: boolean
  stopLeavingFn: (newValue: boolean) => void
}

const Sidebar = ({
  onNavigate,
  canResolveAndSubmit,
  canUseTriggerAndExceptionQualityAuditing,
  stopLeavingFn
}: Props) => {
  const currentUser = useCurrentUser()
  const { courtCase } = useCourtCase()
  const { fetchNewCsrfToken } = useRefreshCsrfToken()
  const onTabChanged = useCallback(() => fetchNewCsrfToken(), [fetchNewCsrfToken])

  let defaultTab = SidebarTab.Pnc
  if (currentUser.hasAccessTo[Permission.Triggers] && courtCase.triggerCount > 0) {
    defaultTab = SidebarTab.Triggers
  } else if (currentUser.hasAccessTo[Permission.Exceptions]) {
    defaultTab = SidebarTab.Exceptions
  }

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
            <TabPanel value={SidebarTab.Triggers} className="moj-tab-panel-triggers tab-panel-triggers">
              <TriggersList onNavigate={onNavigate} />
            </TabPanel>
          </ConditionalRender>
          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Exceptions]}>
            <TabPanel value={SidebarTab.Exceptions} className="moj-tab-panel-exceptions">
              <ExceptionsList
                onNavigate={onNavigate}
                canResolveAndSubmit={canResolveAndSubmit}
                stopLeavingFn={stopLeavingFn}
              />
            </TabPanel>
          </ConditionalRender>
          <TabPanel value={SidebarTab.Pnc} className="moj-tab-panel-pnc-details">
            <PncDetails />
          </TabPanel>
        </Tabs>
      </ConditionalRender>
      <ConditionalRender isRendered={canUseTriggerAndExceptionQualityAuditing}>
        <QualityStatusCard />
      </ConditionalRender>
    </SidebarContainer>
  )
}

export default Sidebar
