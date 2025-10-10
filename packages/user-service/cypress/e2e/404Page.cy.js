describe("404 - Page not found", () => {
  it("should display the correct 404 page when an incorrect url has been requested", () => {
    cy.visit("/bad-url-request", { failOnStatusCode: false })

    cy.contains("Page not found")
    cy.contains("If you typed the web address, check it is correct.")
    cy.contains("If you pasted the web address, check you copied the entire address.")
    cy.contains("If the web address is correct or you selected a link or button, contact support.")
  })

  it("should respond with the correct HTTP status code (404)", () => {
    cy.request({
      failOnStatusCode: false,
      url: "/bad-url-request"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("should create a cookie on 404 if the path is /bichard/court-cases/<num>", () => {
    cy.visit("/bichard/court-cases/733", { failOnStatusCode: false })

    cy.contains("Page not found")
    cy.get("#cookie-set")

    cy.getCookie("qa_case_details_404")
      .should("exist")
      .then((c) => expect(c.value).to.include("/bichard/court-cases/733"))
  })

  it("should not create a cookie on 404 if the path is not /bichard/court-cases/<num>", () => {
    cy.visit("/bichard/something", { failOnStatusCode: false })

    cy.contains("Page not found")
    cy.get("#cookie-set").should("not.exist")

    cy.getCookie("qa_case_details_404").should("not.exist")
  })
})
