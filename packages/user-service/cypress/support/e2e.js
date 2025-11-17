// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands"

// Send in an x-origin header with each request to simulate production
beforeEach(() => {
  cy.intercept("http://bichard7.service.justice.gov.uk/*", (req) => {
    req.url = "/"
  })
  cy.intercept("*", (req) => {
    req.headers["x-origin"] = Cypress.config("baseUrl")
  })
})
