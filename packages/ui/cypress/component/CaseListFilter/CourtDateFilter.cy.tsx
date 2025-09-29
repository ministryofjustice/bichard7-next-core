import CourtDateFilter from "components/SearchFilters/CourtDateFilter"
import "../../../styles/globals.scss"

describe("CourtDateFilter", () => {
  const caseAgeCounts = { Today: 1, Yesterday: 1 }
  const dispatch = () => {}

  it("mounts", () => {
    cy.mount(
      <CourtDateFilter
        caseAgeCounts={caseAgeCounts}
        dispatch={dispatch}
        dateRange={undefined}
        canUseCourtDateReceivedDateMismatchFilters={true}
      />
    )
  })

  it("shows date received mismatch checkbox when feature flag true", () => {
    cy.mount(
      <CourtDateFilter
        caseAgeCounts={caseAgeCounts}
        dispatch={dispatch}
        dateRange={undefined}
        canUseCourtDateReceivedDateMismatchFilters={true}
      />
    )

    cy.get("#case-show-date-received-mismatch").should("exist")
  })

  it("does not show date received mismatch checkbox when feature flag false", () => {
    cy.mount(
      <CourtDateFilter
        caseAgeCounts={caseAgeCounts}
        dispatch={dispatch}
        dateRange={undefined}
        canUseCourtDateReceivedDateMismatchFilters={false}
      />
    )

    cy.get("#case-age").should("exist")
    cy.get("#case-show-date-received-mismatch").should("not.exist")
  })
})
