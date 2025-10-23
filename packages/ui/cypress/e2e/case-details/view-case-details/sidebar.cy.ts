import { loginAndVisit } from "../../../support/helpers"

describe("sidebar", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  describe("sidebar-tabs", () => {
    beforeEach(() => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01", errorCount: 0 }])
      loginAndVisit("/bichard/court-cases/0")
    })

    it("allows keyboard navigation to default sidebar tab", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Defendant").click()
      cy.focused().should("have.focus").and("contain.text", "Defendant")

      cy.focused().tab()
      cy.focused().should("have.focus").and("contain.text", "Hearing")

      cy.focused().tab()
      cy.focused().should("have.focus").and("contain.text", "Case")

      cy.focused().tab()
      cy.focused().should("have.focus").and("contain.text", "Offences")

      cy.focused().tab()
      cy.focused().should("have.focus").and("contain.text", "Notes")

      cy.focused().tab()
      cy.focused().should("have.focus").and("contain.text", "Exceptions")

      cy.focused().tab({ shift: true })
      cy.focused().should("have.focus").and("contain.text", "Notes")

      cy.focused().tab()
      cy.focused().should("have.focus").and("contain.text", "Exceptions")
    })

    it("allows keyboard navigation between sidebar tabs and tab panel", () => {
      cy.get("#exceptions-tab").click()
      cy.focused().should("have.focus").and("contain.text", "Exceptions")

      cy.focused().tab()
      cy.focused().should("have.focus").and("contain.text", "Offence 1")

      cy.focused().tab({ shift: true })
      cy.focused().should("have.focus").and("contain.text", "Exceptions")

      cy.focused().type("{leftArrow}")
      cy.focused().should("have.focus").and("contain.text", "Triggers")
      cy.get(".moj-tab-panel-triggers").should("be.visible").and("contain.text", "There are no triggers for this case.")

      cy.focused().type("{leftArrow}")
      cy.focused().should("have.focus").and("contain.text", "Triggers")

      cy.focused().type("{rightArrow}")
      cy.focused().should("have.focus").and("contain.text", "Exceptions")
      cy.get(".moj-tab-panel-exceptions").should("be.visible").and("contain.text", "HO100102")

      cy.focused().type("{rightArrow}")
      cy.focused().should("have.focus").and("contain.text", "PNC Details")
      cy.get(".moj-tab-panel-pnc-details").should("be.visible").and("contain.text", "Crime Offence Reference")

      cy.focused().type("{rightArrow}")
      cy.focused().should("have.focus").and("contain.text", "PNC Details")
    })
  })

  describe("quality status card", () => {
    it("Should show qualityStatusCard when feature flags enabled and user is a supervisor", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01", errorStatus: "Resolved", triggerCount: 1 }])
      loginAndVisit("Supervisor", "/bichard/court-cases/0")

      cy.get('[name="quality-status-note"]').should("exist")
      cy.get('[name="trigger-quality"]').should("exist")
      cy.get('[name="exception-quality"]').should("exist")
    })

    it("Should not show qualityStatusCard when feature flags disabled", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01", errorStatus: "Resolved" }])
      loginAndVisit("UserMissingFeatureFlags", "/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").should("exist")
      cy.get('[name="quality-status-note"]').should("not.exist")
      cy.get('[name="trigger-quality"]').should("not.exist")
      cy.get('[name="exception-quality"]').should("not.exist")
    })

    it("Should not show qualityStatusCard when user groups are incorrect", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01", errorStatus: "Resolved" }])
      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").should("exist")
      cy.get('[name="quality-status-note"]').should("not.exist")
      cy.get('[name="trigger-quality"]').should("not.exist")
      cy.get('[name="exception-quality"]').should("not.exist")
    })

    it("Should not show qualityStatusCard when case is unresolved", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01", errorStatus: "Unresolved" }])
      loginAndVisit("Supervisor", "/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").should("exist")
      cy.get('[name="quality-status-note"]').should("not.exist")
      cy.get('[name="trigger-quality"]').should("not.exist")
      cy.get('[name="exception-quality"]').should("not.exist")
    })
  })
})
