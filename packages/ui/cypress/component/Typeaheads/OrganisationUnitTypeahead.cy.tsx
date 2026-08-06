import OrganisationUnitTypeahead from "@/components/Typeaheads/OrganisationUnitTypeahead"
import { Amendments } from "@/types/Amendments"
import { DisplayFullCourtCase } from "@/types/display/CourtCases"
import { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { CourtCaseContext, CourtCaseContextType } from "context/CourtCaseContext" // Adjust path to your context file
import { OrganisationUnitsContext } from "context/OrganisationUnitsContext" // Adjust path to your context file
import React from "react"

describe("OrganisationUnitTypeahead Component", () => {
  const courtCase = {
    aho: {
      Exceptions: [
        {
          code: "HO100307",
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            2,
            "Result",
            0,
            "CJSresultCode"
          ]
        }
      ]
    }
  } as unknown as DisplayFullCourtCase

  const mockCourtCaseState = {
    courtCase,
    amendments: {},
    savedAmendments: {}
  }

  const mockOrgUnits: OrganisationUnit[] = [
    {
      topLevelCode: "B",
      topLevelName: "Magistrates' Court",
      secondLevelCode: "01",
      secondLevelName: "London",
      thirdLevelCode: "EF",
      thirdLevelName: "",
      thirdLevelPsaCode: "",
      bottomLevelCode: "00",
      bottomLevelName: ""
    },
    {
      topLevelCode: "B",
      topLevelName: "Crown Court",
      secondLevelCode: "02",
      secondLevelName: "Manchester",
      thirdLevelCode: "GH",
      thirdLevelName: "",
      thirdLevelPsaCode: "5678",
      bottomLevelCode: "00"
    }
  ]

  interface TestWrapperProps {
    children: React.ReactNode
    amendSpy: (payload: Amendments) => void
  }

  const TestWrapper = ({ children, amendSpy }: TestWrapperProps) => {
    const dispatchMock = (value: React.SetStateAction<CourtCaseContextType>): void => {
      if (typeof value === "function") {
        const resultingState = value(mockCourtCaseState)
        amendSpy(resultingState.amendments)
      }
    }

    const mockContextValue: [CourtCaseContextType, React.Dispatch<React.SetStateAction<CourtCaseContextType>>] = [
      mockCourtCaseState,
      dispatchMock
    ]

    return (
      <CourtCaseContext.Provider value={mockContextValue}>
        <OrganisationUnitsContext.Provider value={{ organisationUnits: mockOrgUnits }}>
          {children}
        </OrganisationUnitsContext.Provider>
      </CourtCaseContext.Provider>
    )
  }

  it("renders with an initial value if provided", () => {
    cy.mount(
      <TestWrapper amendSpy={cy.stub()}>
        <OrganisationUnitTypeahead resultIndex={0} offenceIndex={1} value="B01EF00" />
      </TestWrapper>
    )

    cy.get("input#next-hearing-location").should("be.visible").and("have.value", "B01EF00")
  })

  it("filters organisation units locally from context on typing", () => {
    cy.mount(
      <TestWrapper amendSpy={cy.stub()}>
        <OrganisationUnitTypeahead resultIndex={0} offenceIndex={1} />
      </TestWrapper>
    )

    cy.get("input#next-hearing-location").type("Magistrates")

    cy.get("ul").children("li").should("have.length", 1).and("contain.text", "Magistrates' Court London")
  })

  it("fires amend context updates and UI form state flags sequentially on typing updates", () => {
    const amendSpy = cy.stub().as("amendSpy")
    const setChangedSpy = cy.stub().as("setChanged")
    const setSavedSpy = cy.stub().as("setSaved")

    cy.mount(
      <TestWrapper amendSpy={amendSpy}>
        <OrganisationUnitTypeahead resultIndex={0} offenceIndex={1} setChanged={setChangedSpy} setSaved={setSavedSpy} />
      </TestWrapper>
    )

    cy.get("input#next-hearing-location").type("B")

    cy.get("@setChanged").should("have.been.calledWith", true)
    cy.get("@setSaved").should("have.been.calledWith", false)

    cy.get("@amendSpy")
      .should("have.been.called")
      .its("lastCall.args.0")
      .should("deep.equal", {
        nextSourceOrganisation: [
          {
            resultIndex: 0,
            offenceIndex: 1,
            value: "B"
          }
        ]
      })
  })
})
