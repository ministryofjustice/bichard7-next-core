describe("GOV.UK Assets", () => {
  it("should provide copyright logo that loads correctly", () => {
    cy.visit("/login")

    cy.get(".govuk-footer__copyright-logo").within((el) => {
      cy.window().then((win) => {
        const footerLogo = win.getComputedStyle(el[0], "::before")
        expect(footerLogo.getPropertyValue("mask-image")).to.contain("govuk-crest.svg")
      })
    })
  })

  it("should provide favicon icon that loads correctly", () => {
    cy.visit("/login")
    cy.get("link[rel='shortcut icon']").should("have.attr", "href").and("include", "favicon.ico")
  })
})
