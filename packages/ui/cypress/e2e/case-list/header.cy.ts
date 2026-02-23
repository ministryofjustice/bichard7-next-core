import { loginAndVisit } from "../../support/helpers"

describe("Home", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.viewport(1280, 720)
    })

    context("top-nav", () => {
      it("as a user that is not part of the 'UserManager' group, I should have access to the correct nav items", () => {
        loginAndVisit("GeneralHandler")

        cy.contains("nav a", "Case list").should("have.attr", "href", "/bichard/")
        cy.contains("nav a", "Reports").should("not.exist")
        cy.contains("nav a", "Audit").should("not.exist")
        cy.contains("nav a", "User management").should("not.exist")
        cy.contains("nav a", "Help").should("have.attr", "href", "/help/")
        cy.contains("nav a", "Sign out").should("have.attr", "href", "/users/logout/")
      })

      it("as a user who is part of the 'TriggerHandler' group, I should have access to these nav items", () => {
        loginAndVisit("TriggerHandler")

        cy.contains("nav a", "Case list").should("have.attr", "href", "/bichard/")
        cy.contains("nav a", "Reports").should("not.exist")
        cy.contains("nav a", "Audit").should("not.exist")
        cy.contains("nav a", "User management").should("not.exist")
        cy.contains("nav a", "Help").should("have.attr", "href", "/help/")
        cy.contains("nav a", "Sign out").should("have.attr", "href", "/users/logout/")
      })

      it("as a user who is part of the 'UserManager' group, I should have access to these nav items", () => {
        loginAndVisit("UserManager")

        cy.contains("nav a", "Case list").should("have.attr", "href", "/bichard/")
        cy.contains("nav a", "Reports").should("not.exist")
        cy.contains("nav a", "Audit").should("not.exist")
        cy.contains("nav a", "User management").should("have.attr", "href", "/users/users/")
        cy.contains("nav a", "Help").should("have.attr", "href", "/help/")
        cy.contains("nav a", "Sign out").should("have.attr", "href", "/users/logout/")
      })

      it("as a user that is part of the Supervisor group, I should have access to these nav items", () => {
        loginAndVisit("Supervisor")

        cy.contains("nav a", "Case list").should("have.attr", "href", "/bichard/")
        cy.contains("nav a", "Reports").should("have.attr", "href", "/bichard/report-selection")
        cy.contains("nav a", "Audit").should("have.attr", "href", "/bichard/audit/search")
        cy.contains("nav a", "User management").should("not.exist")
        cy.contains("nav a", "Help").should("have.attr", "href", "/help/")
        cy.contains("nav a", "Sign out").should("have.attr", "href", "/users/logout/")
      })
    })

    context("phase banner", () => {
      it("displays a phase banner", () => {
        loginAndVisit("GeneralHandler")

        cy.contains("Beta")
      })
    })
  })
})

export {}
