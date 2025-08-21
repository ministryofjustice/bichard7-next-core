import { CaseDetailsRow } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CaseDetailsRow"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayNote } from "types/display/Notes"
import { MockNextRouter } from "../../support/MockNextRouter"

describe("CaseDetailsRow", () => {
  const courtCase = {
    notes: [] as DisplayNote[],
    errorId: 1,
    courtDate: new Date().toISOString(),
    courtName: "Court Name",
    ptiurn: "Case0001"
  } as DisplayPartialCourtCase

  it("shows the court name", () => {
    cy.mount(
      <MockNextRouter>
        <CaseDetailsRow courtCase={courtCase} reasonCell={undefined} lockTag={undefined} previousPath={null} />
      </MockNextRouter>
    )

    cy.contains("Court Name")
  })
})
