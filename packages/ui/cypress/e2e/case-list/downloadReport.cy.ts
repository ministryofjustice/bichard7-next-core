describe("Allows users to download case list as report", () => {
  it("should not show download button to users without permission", () => {
    cy.loginAs("GeneralHandler")
    cy.visit("/bichard")

    cy.get("#download-button").should("not.exist")
  })

  it("should show download button to supervisors", () => {
    cy.loginAs("Supervisor")
    cy.visit("/bichard")

    cy.get("#download-button").should("exist")
  })
})
