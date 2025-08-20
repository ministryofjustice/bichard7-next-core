import { useCourtCase } from "context/CourtCaseContext"
import { useBeforeunload } from "hooks/useBeforeunload"
import useRefreshCsrfToken from "hooks/useRefreshCsrfToken"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import type CaseDetailsTab from "types/CaseDetailsTab"
import { isValidCaseDetailsTab } from "types/CaseDetailsTab"
import type NavigationHandler from "types/NavigationHandler"
import { updateTabLink } from "../../utils/updateTabLink"
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
}

const CourtCaseDetails: React.FC<Props> = ({ canResolveAndSubmit }) => {
  const router = useRouter()
  const { query } = router

  const urlQueryTab = query.tab as string | undefined
  const queryTab = `${urlQueryTab?.charAt(0).toUpperCase()}${urlQueryTab?.slice(1)}`
  let tab: CaseDetailsTab | undefined

  if (isValidCaseDetailsTab(queryTab)) {
    tab = queryTab
  }

  const { courtCase } = useCourtCase()
  const [activeTab, setActiveTab] = useState<CaseDetailsTab>(tab ?? "Defendant")
  const [selectedOffenceSequenceNumber, setSelectedOffenceSequenceNumber] = useState<number | undefined>(undefined)
  const [useBeforeUnload, setUseBeforeUnload] = useState<boolean>(false)

  useRefreshCsrfToken({ dependency: activeTab })

  const stopLeavingFn = useCallback((newValue: boolean) => {
    setUseBeforeUnload(newValue)
  }, [])

  useBeforeunload(useBeforeUnload ? (event: BeforeUnloadEvent) => event.preventDefault() : undefined)

  const handleNavigation: NavigationHandler = ({ location, args }) => {
    switch (location) {
      case "Case Details > Case": {
        setActiveTab("Case")
        const newPath = updateTabLink(router, "Case")
        router.replace(newPath, newPath, { shallow: true })

        break
      }
      case "Case Details > Offences": {
        if (typeof args?.offenceOrderIndex === "number") {
          setSelectedOffenceSequenceNumber(+args.offenceOrderIndex)
        }
        setActiveTab("Offences")
        const newPath = updateTabLink(router, "Offences")
        router.replace(newPath, newPath, { shallow: true })

        break
      }
    }
  }

  return (
    <PanelsGridRow aria-live="polite" aria-label="Case Details page loaded" className="govuk-grid-row">
      <CourtCaseDetailsTabs
        activeTab={activeTab}
        onTabClick={(tab) => {
          setActiveTab(tab)
          updateTabLink(router, tab)
        }}
      />

      <PanelsGridCol className="govuk-grid-column-two-thirds">
        <CourtCaseDetailsPanel visible={activeTab === "Defendant"}>
          <DefendantDetails />
        </CourtCaseDetailsPanel>

        <CourtCaseDetailsPanel visible={activeTab === "Hearing"}>
          <HearingDetails hearing={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing} />
        </CourtCaseDetailsPanel>

        <CourtCaseDetailsPanel visible={activeTab === "Case"}>
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

        <Notes visible={activeTab === "Notes"} />
      </PanelsGridCol>

      <SideBar className="govuk-grid-column-one-third">
        <TriggersAndExceptions
          onNavigate={handleNavigation}
          canResolveAndSubmit={canResolveAndSubmit}
          stopLeavingFn={stopLeavingFn}
        />
      </SideBar>
    </PanelsGridRow>
  )
}

export default CourtCaseDetails
