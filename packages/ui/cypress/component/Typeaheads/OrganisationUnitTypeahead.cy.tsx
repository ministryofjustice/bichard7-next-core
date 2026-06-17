import OrganisationUnitTypeahead from "@/components/Typeaheads/OrganisationUnitTypeahead"
import { Amendments } from "@/types/Amendments"
import { DisplayFullCourtCase } from "@/types/display/CourtCases"
import { CourtCaseContext, CourtCaseContextType } from "context/CourtCaseContext" // Adjust path to your context file
import React from "react"
import OrganisationUnitApiResponse from "types/OrganisationUnitApiResponse"

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

  const mockOrgUnits: OrganisationUnitApiResponse = [
    { fullOrganisationCode: "B01EF00", fullOrganisationName: "Magistrates' Court London" },
    { fullOrganisationCode: "B02GH00", fullOrganisationName: "Crown Court Manchester" }
  ]

  beforeEach(() => {
    cy.intercept("GET", "/bichard/api/organisation-units*", (req) => {
      const url = new URL(req.url)
      const search = url.searchParams.get("search") ?? ""

      const filtered = mockOrgUnits.filter(
        (unit) =>
          unit.fullOrganisationCode.toLowerCase().includes(search.toLowerCase()) ||
          unit.fullOrganisationName.toLowerCase().includes(search.toLowerCase())
      )

      req.reply({
        statusCode: 200,
        body: filtered
      })
    }).as("fetchOrgUnits")
  })

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

    return <CourtCaseContext.Provider value={mockContextValue}>{children}</CourtCaseContext.Provider>
  }

  it("renders with an initial value if provided", () => {
    cy.mount(
      <TestWrapper amendSpy={cy.stub()}>
        <OrganisationUnitTypeahead resultIndex={0} offenceIndex={1} value="B01EF00" />
      </TestWrapper>
    )

    cy.get("input#next-hearing-location").should("be.visible").and("have.value", "B01EF00")
  })

  it("triggers network request and sets parent organization lists on load/input", () => {
    const setOrganisationsSpy = cy.stub().as("setOrganisations")

    cy.mount(
      <TestWrapper amendSpy={cy.stub()}>
        <OrganisationUnitTypeahead resultIndex={0} offenceIndex={1} setOrganisations={setOrganisationsSpy} />
      </TestWrapper>
    )

    cy.get("input#next-hearing-location").type("Magistrates")
    cy.wait("@fetchOrgUnits")

    cy.get("@setOrganisations").should("have.been.calledWithMatch", [mockOrgUnits[0]])
    cy.get("ul").children("li").should("have.length", 1)
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
