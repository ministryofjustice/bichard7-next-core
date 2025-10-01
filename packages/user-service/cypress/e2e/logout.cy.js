describe("Logging Out", () => {
  before(() => {
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")
  })

  beforeEach(() => {
    cy.clearCookies()
  })

  it("can successfully log out after logging in", () => {
    cy.login("bichard01@example.com", "password")
    cy.getCookie(".AUTH").should("exist")

    cy.contains("Sign out").click()
    cy.getCookie(".AUTH").should("not.exist")
    cy.get("body").contains(/Signed out of Bichard/i)
  })

  it("links back to login page after logging out", () => {
    cy.login("bichard01@example.com", "password")
    cy.contains("Sign out").click()

    cy.get("body").contains(/In order to sign back in, please click here/i)
    cy.get("a[data-test=log-back-in]").click()

    cy.url().should("match", /\/login\/?$/)
    cy.get("input[type=email]").should("be.visible")
    cy.get("button[type=submit").should("be.visible")
  })
})
