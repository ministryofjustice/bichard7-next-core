import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useState } from "react"
import { useBeforeunload } from "react-beforeunload"
import type CaseDetailsTab from "types/CaseDetailsTab"
import type NavigationHandler from "types/NavigationHandler"
import { PanelsGridCol, PanelsGridRow, SideBar } from "./CourtCaseDetails.styles"
import TriggersAndExceptions from "./Sidebar/Sidebar"
import { CourtCaseDetailsPanel } from "./Tabs/CourtCaseDetailsPanels"
import { CourtCaseDetailsTabs } from "./Tabs/CourtCaseDetailsTabs"
import { CaseInformation } from "./Tabs/Panels/CaseInformation"
import { DefendantDetails } from "./Tabs/Panels/DefendantDetails"
import { HearingDetails } from "./Tabs/Panels/HearingDetails"
import { Notes } from "./Tabs/Panels/Notes/Notes"
import { Offences } from "./Tabs/Panels/Offences/Offences"

interface Props {
  isLockedByCurrentUser: boolean
  canResolveAndSubmit: boolean
}

const sideBarWidth = "33%"
const contentWidth = "67%"

const CourtCaseDetails: React.FC<Props> = ({ isLockedByCurrentUser, canResolveAndSubmit }) => {
  const { courtCase } = useCourtCase()
  const [activeTab, setActiveTab] = useState<CaseDetailsTab>("Defendant")
  const [selectedOffenceSequenceNumber, setSelectedOffenceSequenceNumber] = useState<number | undefined>(undefined)
  const [useBeforeUnload, setUseBeforeUnload] = useState<boolean>(false)

  const stopLeavingFn = useCallback((newValue: boolean) => {
    setUseBeforeUnload(newValue)
  }, [])

  useBeforeunload(useBeforeUnload ? (event: BeforeUnloadEvent) => event.preventDefault() : undefined)

  const handleNavigation: NavigationHandler = ({ location, args }) => {
    switch (location) {
      case "Case Details > Case":
        setActiveTab("Case")
        break
      case "Case Details > Offences":
        if (typeof args?.offenceOrderIndex === "number") {
          setSelectedOffenceSequenceNumber(+args.offenceOrderIndex)
        }
        setActiveTab("Offences")
        break
    }
  }

  return (
    <>
      <CourtCaseDetailsTabs
        activeTab={activeTab}
        onTabClick={(tab) => {
          setActiveTab(tab)
        }}
        width={contentWidth}
      />

      <PanelsGridRow>
        <PanelsGridCol setWidth={contentWidth}>
          <CourtCaseDetailsPanel visible={activeTab === "Defendant"} heading={"Defendant details"}>
            <DefendantDetails />
          </CourtCaseDetailsPanel>

          <CourtCaseDetailsPanel visible={activeTab === "Hearing"} heading={"Hearing details"}>
            <HearingDetails hearing={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing} />
          </CourtCaseDetailsPanel>

          <CourtCaseDetailsPanel visible={activeTab === "Case"} heading={"Case"}>
            <CaseInformation caseInformation={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case} />
          </CourtCaseDetailsPanel>

          <Offences
            visible={activeTab === "Offences"}
            exceptions={courtCase.aho.Exceptions}
            offences={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case?.HearingDefendant?.Offence}
            onOffenceSelected={(offenceIndex) => {
              setSelectedOffenceSequenceNumber(offenceIndex)
            }}
            selectedOffenceSequenceNumber={selectedOffenceSequenceNumber}
          />

          <Notes visible={activeTab === "Notes"} isLockedByCurrentUser={isLockedByCurrentUser} />
        </PanelsGridCol>

        <SideBar setWidth={sideBarWidth}>
          <TriggersAndExceptions
            onNavigate={handleNavigation}
            canResolveAndSubmit={canResolveAndSubmit}
            stopLeavingFn={stopLeavingFn}
          />
        </SideBar>
      </PanelsGridRow>
    </>
  )
}

export default CourtCaseDetails
