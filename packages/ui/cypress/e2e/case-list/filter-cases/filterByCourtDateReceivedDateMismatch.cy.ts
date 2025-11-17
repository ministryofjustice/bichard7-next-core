import { visitBasePath } from "../../../support/helpers"

describe("Filtering cases by court date received date mismatch", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("clearTriggers")
    cy.loginAs("GeneralHandler")
  })

  it("Should update 'selected filter' chip when changing court date received date mismatch filter", () => {
    cy.visit("/bichard")

    cy.get("#court-date-received-date-mismatch").click()
    cy.get(".moj-filter__tag").contains("Cases where date received is different")
    cy.get("#court-date-received-date-mismatch").should("be.checked")
  })

  it("Should update 'applied filter' chip when changing court date received date mismatch filter", () => {
    cy.visit("/bichard")

    cy.get("#court-date-received-date-mismatch").click()
    cy.get(".moj-filter__tag").contains("Cases where date received is different")
    cy.get("#search").click()
    cy.get("#court-date-received-date-mismatch").should("be.checked")
    cy.get(".govuk-heading-m").contains("Applied filters")
    cy.get(".moj-filter__tag").contains("Cases where date received is different")
  })

  it("Should filter cases by court date received date mismatch", () => {
    const firstDate = new Date("2001-09-26")
    const secondDate = new Date("2008-01-26")
    const thirdDate = new Date("2008-03-26")
    const fourthDate = new Date("2013-10-16")
    const orgCode = "011111"

    cy.task("insertCourtCasesWithFields", [
      { courtDate: firstDate, messageReceivedTimestamp: firstDate, orgForPoliceFilter: orgCode },
      { courtDate: secondDate, messageReceivedTimestamp: secondDate, orgForPoliceFilter: orgCode },
      { courtDate: secondDate, messageReceivedTimestamp: thirdDate, orgForPoliceFilter: orgCode },
      { courtDate: thirdDate, messageReceivedTimestamp: fourthDate, orgForPoliceFilter: orgCode }
    ])

    visitBasePath()

    // When checkbox isn't clicked
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 4)
    cy.contains("Case00000")
    cy.contains("Case00001")
    cy.contains("Case00002")
    cy.contains("Case00003")

    // Filter for cases with mismatch
    cy.get("#court-date-received-date-mismatch").click()
    cy.get("#search").click()
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 2)
    cy.contains("Case00002")
    cy.contains("Case00003")
    cy.get("#received-date-sort").contains("Received date")
    cy.contains("16/10/2013")
    cy.contains("26/03/2008")
  })
})

export {}
