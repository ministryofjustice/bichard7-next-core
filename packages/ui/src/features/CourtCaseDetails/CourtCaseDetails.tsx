import type CaseDetailsTab from "types/CaseDetailsTab"
import type NavigationHandler from "types/NavigationHandler"

import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useState } from "react"
import { useBeforeunload } from "react-beforeunload"

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
  canResolveAndSubmit: boolean
  isLockedByCurrentUser: boolean
}

const sideBarWidth = "33%"
const contentWidth = "67%"

const CourtCaseDetails: React.FC<Props> = ({ canResolveAndSubmit, isLockedByCurrentUser }) => {
  const { courtCase } = useCourtCase()
  const [activeTab, setActiveTab] = useState<CaseDetailsTab>("Defendant")
  const [selectedOffenceSequenceNumber, setSelectedOffenceSequenceNumber] = useState<number | undefined>(undefined)
  const [useBeforeUnload, setUseBeforeUnload] = useState<boolean>(false)

  const stopLeavingFn = useCallback((newValue: boolean) => {
    setUseBeforeUnload(newValue)
  }, [])

  useBeforeunload(useBeforeUnload ? (event: BeforeUnloadEvent) => event.preventDefault() : undefined)

  const handleNavigation: NavigationHandler = ({ args, location }) => {
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
          <CourtCaseDetailsPanel heading={"Defendant details"} visible={activeTab === "Defendant"}>
            <DefendantDetails />
          </CourtCaseDetailsPanel>

          <CourtCaseDetailsPanel heading={"Hearing details"} visible={activeTab === "Hearing"}>
            <HearingDetails hearing={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing} />
          </CourtCaseDetailsPanel>

          <CourtCaseDetailsPanel heading={"Case"} visible={activeTab === "Case"}>
            <CaseInformation caseInformation={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case} />
          </CourtCaseDetailsPanel>

          <Offences
            exceptions={courtCase.aho.Exceptions}
            offences={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case?.HearingDefendant?.Offence}
            onOffenceSelected={(offenceIndex) => {
              setSelectedOffenceSequenceNumber(offenceIndex)
            }}
            selectedOffenceSequenceNumber={selectedOffenceSequenceNumber}
            visible={activeTab === "Offences"}
          />

          <Notes isLockedByCurrentUser={isLockedByCurrentUser} visible={activeTab === "Notes"} />
        </PanelsGridCol>

        <SideBar setWidth={sideBarWidth}>
          <TriggersAndExceptions
            canResolveAndSubmit={canResolveAndSubmit}
            onNavigate={handleNavigation}
            stopLeavingFn={stopLeavingFn}
          />
        </SideBar>
      </PanelsGridRow>
    </>
  )
}

export default CourtCaseDetails
