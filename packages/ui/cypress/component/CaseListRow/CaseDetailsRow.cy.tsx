import { CaseDetailsRow } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CaseDetailsRow"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayNote } from "types/display/Notes"
import { LockReason } from "types/LockReason"
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

  describe("with errorLockedByUsername not null", () => {
    it("shows error locked icon with LockReason as Exceptions", () => {
      courtCase.errorLockedByUsername = "bob"

      cy.mount(
        <MockNextRouter>
          <CaseDetailsRow
            courtCase={courtCase}
            reasonCell={undefined}
            lockTag={undefined}
            previousPath={null}
            lockReason={LockReason.Exceptions}
          />
        </MockNextRouter>
      )

      cy.get(".caseDetailsRow td:nth-child(1) img").should("exist")
    })

    it("shows error locked icon with LockReason as Exceptions and triggerLockedByUsername", () => {
      courtCase.errorLockedByUsername = "bob"
      courtCase.triggerLockedByUsername = "bob"

      cy.mount(
        <MockNextRouter>
          <CaseDetailsRow
            courtCase={courtCase}
            reasonCell={undefined}
            lockTag={undefined}
            previousPath={null}
            lockReason={LockReason.Exceptions}
          />
        </MockNextRouter>
      )

      cy.get(".caseDetailsRow td:nth-child(1) img").should("exist")
    })

    it("doesn't show error locked icon with LockReason as Triggers", () => {
      courtCase.errorLockedByUsername = "bob"
      courtCase.triggerLockedByUsername = null

      cy.mount(
        <MockNextRouter>
          <CaseDetailsRow
            courtCase={courtCase}
            reasonCell={undefined}
            lockTag={undefined}
            previousPath={null}
            lockReason={LockReason.Triggers}
          />
        </MockNextRouter>
      )

      cy.get(".caseDetailsRow td:nth-child(1) img").should("not.exist")
    })
  })

  describe("with errorLockedByUsername as null", () => {
    beforeEach(() => {
      courtCase.errorLockedByUsername = null
    })

    it("doesn't show error locked icon with LockReason as Exceptions", () => {
      cy.mount(
        <MockNextRouter>
          <CaseDetailsRow
            courtCase={courtCase}
            reasonCell={undefined}
            lockTag={undefined}
            previousPath={null}
            lockReason={LockReason.Exceptions}
          />
        </MockNextRouter>
      )

      cy.get(".caseDetailsRow td:nth-child(1) img").should("not.exist")
    })

    it("shows trigger locked icon with LockReason as Triggers", () => {
      courtCase.triggerLockedByUsername = "bob"

      cy.mount(
        <MockNextRouter>
          <CaseDetailsRow
            courtCase={courtCase}
            reasonCell={undefined}
            lockTag={undefined}
            previousPath={null}
            lockReason={LockReason.Triggers}
          />
        </MockNextRouter>
      )

      cy.get(".caseDetailsRow td:nth-child(1) img").should("exist")
    })

    it("doesn't show trigger locked icon with LockReason as Triggers", () => {
      courtCase.triggerLockedByUsername = null

      cy.mount(
        <MockNextRouter>
          <CaseDetailsRow
            courtCase={courtCase}
            reasonCell={undefined}
            lockTag={undefined}
            previousPath={null}
            lockReason={LockReason.Triggers}
          />
        </MockNextRouter>
      )

      cy.get(".caseDetailsRow td:nth-child(1) img").should("not.exist")
    })
  })
})
