describe("Filters with triggers", () => {
  beforeEach(() => {
    cy.loginAs("Bichard011111")
  })

  it("will show selected filters", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()

    cy.get(".applied-filters .moj-filter__tag").should("length", 0)
    cy.get(".selected-filters .moj-filter__tag").should("length", 4)

    cy.get(".selected-filters .moj-filter__tag").contains("PR08")
    cy.get(".selected-filters .moj-filter__tag").contains("PR10")
    cy.get(".selected-filters .moj-filter__tag").contains("PR19")
    cy.get(".selected-filters .moj-filter__tag").contains("PR30")
  })

  it("will show applied filters", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()
    cy.get("#search").click()

    cy.get(".applied-filters .moj-filter__tag").should("length", 4)
    cy.get(".selected-filters .moj-filter__tag").should("length", 0)

    cy.get(".applied-filters .moj-filter__tag").contains("PR08")
    cy.get(".applied-filters .moj-filter__tag").contains("PR10")
    cy.get(".applied-filters .moj-filter__tag").contains("PR19")
    cy.get(".applied-filters .moj-filter__tag").contains("PR30")
  })

  it("will show applied and selected filters and show the title Reason codes", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()

    cy.get("input#trpr0008").click()

    cy.get("#search").click()

    cy.get("input#trpr0008").click()

    cy.get(".applied-filters .moj-filter__tag").should("length", 3)
    cy.get(".selected-filters .moj-filter__tag").should("length", 1)

    cy.get(".applied-filters .moj-filter__tag").contains("PR10")
    cy.get(".applied-filters .moj-filter__tag").contains("PR19")
    cy.get(".applied-filters .moj-filter__tag").contains("PR30")

    cy.get(".selected-filters .moj-filter__tag").contains("PR08")

    cy.get(".applied-filters h3").contains("Reason codes").should("exist")
    cy.get(".selected-filters h3").contains("Reason codes").should("exist")
  })

  it("will not the title Reason codes when a reason code is not selected but something else is selected", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()

    cy.get("#search").click()

    cy.get("label[for=exceptions-reason]").click()

    cy.get(".applied-filters h3").contains("Reason codes").should("exist")
    cy.get(".selected-filters h3").contains("Reason codes").should("not.exist")
  })
})
