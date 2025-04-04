import { loginAndVisit } from "../../../support/helpers"

describe("sidebar tabs", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01", errorCount: 0 }])
  })

  it("allows keyboard navigation to default sidebar tab", () => {
    loginAndVisit("/bichard/court-cases/0")

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
    loginAndVisit("/bichard/court-cases/0")

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
