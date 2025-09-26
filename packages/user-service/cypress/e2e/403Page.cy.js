describe("403 - Access denied", () => {
  it("should display the correct 403 page", () => {
    cy.visit("/403", { failOnStatusCode: false })

    cy.contains("Access denied")
    cy.contains("You do not have permission to access this page.")
    cy.contains("We suggest that you return to the home page and choose an available service to you.")
    cy.contains("If you believe you have permission to access this page, you can contact support to report this issue.")
  })

  it("should respond with the correct HTTP status code (403)", () => {
    cy.request({
      failOnStatusCode: false,
      url: "/403"
    }).then((response) => {
      expect(response.status).to.eq(403)
    })
  })
})
