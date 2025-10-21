describe("Authentication API endpoint", () => {
  beforeEach(() => {
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")

    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp", "B7Supervisor_grp"]
    })
  })

  it("should say user is unauthenticated if not logged in", () => {
    cy.clearCookies()
    cy.request({ url: "/api/auth", headers: { Referer: "/users/users" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property("authenticated", false)
    })
  })

  it("should say user is authenticated if logged in", () => {
    cy.login("bichard01@example.com", "password")

    cy.request({ url: "/api/auth", headers: { Referer: "/users" } }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("authenticated", true)
    })
  })

  it("should say user is not authenticated if failed to login", () => {
    const emailAddress = "bichard01@example.com"
    const password = "wrongpassword"

    cy.visit("/login")
    cy.get("input[type=email]").type(emailAddress)
    cy.get("input#password").type(password)
    cy.get("button[type=submit]").click()
    cy.get("input#validationCode").should("exist")
    cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
      cy.get("input#validationCode").type(verificationCode)
      cy.get("button[type=submit]").click()
    })

    cy.request({ url: "/api/auth", headers: { Referer: "/users/users" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property("authenticated", false)
    })
  })

  it("should say user doesn't have permission to access the user manager url if user is not in the user manager group", () => {
    cy.login("bichard02@example.com", "password")

    cy.request({ url: "/api/auth", headers: { Referer: "/users/users" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(403)
      expect(response.body).to.have.property("authenticated", true)
    })
  })

  it("should say user doesn't have permission to access the bichard url if user is not in the bichard group", () => {
    cy.login("bichard02@example.com", "password")

    cy.request({ url: "/api/auth", headers: { Referer: "/bichard-ui" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(403)
      expect(response.body).to.have.property("authenticated", true)
    })
  })

  it("should say user doesn't have permission to access the reports url if user is not in the bichard group", () => {
    cy.login("bichard02@example.com", "password")

    cy.request({ url: "/api/auth", headers: { Referer: "/reports/foo" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(403)
      expect(response.body).to.have.property("authenticated", true)
    })
  })

  it("should say user can access home page even if user does not belong to any group", () => {
    cy.login("bichard02@example.com", "password")

    cy.request({ url: "/api/auth", headers: { Referer: "/" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("authenticated", true)
    })
  })
})
