const { _ } = Cypress

describe("Home", () => {
  before(() => {
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp", "B7AuditLoggingManager_grp", "B7Supervisor_grp", "B7NewUI_grp"]
    })
    cy.task("insertIntoUserGroupsTable", {
      email: "newbicharduser@example.com",
      groups: ["B7UserManager_grp", "B7AuditLoggingManager_grp", "B7Supervisor_grp", "B7NewUI_grp"]
    })
  })

  it("should redirect user to home page after successful login", () => {
    const emailAddress = "bichard01@example.com"
    cy.login(emailAddress, "password")
    cy.get("h1").contains(/welcome bichard user 01/i)
    cy.get("a[id=user-management-link]").should("have.attr", "href").and("equal", "/users/users")
    cy.get("a[id=bichard-link]").should("have.attr", "href").and("equal", "/bichard-ui/InitialRefreshList")
  })

  it("should show paginated service messages", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("body").contains("Latest service messages")
    cy.get(".govuk-grid-column-one-third > .govuk-grid-row").each((row, index) => {
      cy.wrap(row)
        .get(".govuk-body")
        .contains(`Message ${13 - index}`)
    })

    cy.get('a[data-test="Next"]').click()

    cy.get(".govuk-grid-column-one-third > .govuk-grid-row").each((row, index) => {
      cy.wrap(row)
        .get(".govuk-body")
        .contains(`Message ${8 - index}`)
    })

    cy.get('a[data-test="Prev"]').click()

    cy.get(".govuk-grid-column-one-third > .govuk-grid-row").each((row, index) => {
      cy.wrap(row)
        .get(".govuk-body")
        .contains(`Message ${13 - index}`)
    })
  })

  it("should show link to new bichard", () => {
    cy.login("bichard01@example.com", "password")

    cy.get("a").contains("Access New Bichard").should("have.attr", "href", "/bichard")
  })

  it("should show link to new bichard case details page with cookie", () => {
    cy.login("bichard01@example.com", "password")

    cy.setCookie(`qs_case_details_d1413a9b5b148735`, "1", { path: "/" }).then(() => {
      cy.reload()
      cy.get("a")
        .contains("Access New Bichard")
        .should("have.attr", "href")
        .and("match", /^\/bichard\/court-cases\/1(\?.*)?$/)
    })
  })

  it("should show link to new bichard without case details page with 404 cookie", () => {
    cy.login("bichard01@example.com", "password")

    cy.setCookie(`qa_case_details_404`, "/bichard/court-cases/733").then(() => {
      cy.reload()
      cy.get("a").contains("Access New Bichard").should("have.attr", "href", "/bichard")
    })
  })

  it("should show link to old bichard before new bichard if feature flag not set", () => {
    cy.login("bichard01@example.com", "password")

    cy.get("a.access-bichard-link")
      .then((buttons) => _.map(buttons, "textContent"))
      .then((buttonsTexts) => {
        expect(buttonsTexts).to.deep.eq(["Access Bichard", "Access New Bichard"])
      })
  })

  it("should show link to new bichard before old bichard if feature flag set", () => {
    cy.login("newbicharduser@example.com", "password")

    cy.get("a.access-bichard-link")
      .then((buttons) => _.map(buttons, "textContent"))
      .then((buttonsTexts) => {
        expect(buttonsTexts).to.deep.eq(["Access New Bichard", "Access Bichard"])
      })
  })
})
