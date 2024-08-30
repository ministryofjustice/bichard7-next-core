import { loginAndVisit } from "../../../support/helpers"

describe("Manually resolve exceptions", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should be able to resolve a case which is visible and locked by the user", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 0,
        errorLockedByUsername: "GeneralHandler",
        triggerLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit()

    cy.findByText("NAME Defendant").click()

    cy.get(".case-details-sidebar #exceptions-tab").click()
    cy.get("button").contains("Mark as manually resolved").click()
    cy.get("H1").should("have.text", "Resolve Case")
    cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="reason"]').select("PNCRecordIsAccurate")
    cy.get("button").contains("Resolve").click()

    cy.visit("/bichard/court-cases/0")

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Record Manually Resolved. Reason: PNCRecordIsAccurate. Reason Text:")
  })

  it("Should prompt the user to enter resolution details if the reason is Reallocated", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 0,
        errorLockedByUsername: "GeneralHandler",
        triggerLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit()

    cy.findByText("NAME Defendant").click()

    cy.get(".case-details-sidebar #exceptions-tab").click()
    cy.get("button").contains("Mark as manually resolved").click()
    cy.get("H1").should("have.text", "Resolve Case")
    cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="reason"]').select("Reallocated")
    cy.get("button").contains("Resolve").click()

    cy.contains("Reason text is required").should("be.visible")

    cy.get("textarea").type("Some reason text")
    cy.get("button").contains("Resolve").click()

    cy.visit("/bichard/court-cases/0")

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains(
      "GeneralHandler: Portal Action: Record Manually Resolved. Reason: Reallocated. Reason Text: Some reason text"
    )
  })

  it("Should return 404 for a case that this user can not see", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "02" }])
    cy.loginAs("GeneralHandler")

    cy.request({
      failOnStatusCode: false,
      url: "/bichard/court-cases/0/resolve"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("Should return 404 for a case that does not exist", () => {
    cy.loginAs("GeneralHandler")

    cy.request({
      failOnStatusCode: false,
      url: "/court-cases/1/notes/resolve"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })
})

export {}
