import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { loginAndVisit } from "../../support/helpers"

describe("Search", () => {
  context("When the user is a supervisor", () => {
    before(() => {
      cy.task("clearUsers")
      cy.task("insertUsers", {
        users: [
          {
            username: "username01",
            forenames: "username",
            surname: "01",
            email: "username01@example.com",
            visibleForces: ["01", "001"]
          },
          {
            username: "username02",
            forenames: "username",
            surname: "02",
            email: "username02@example.com",
            visibleForces: ["01", "001"]
          },
          {
            username: "username03",
            forenames: "username",
            surname: "03",
            email: "username03@example.com",
            visibleForces: ["01", "001"]
          }
        ],
        userGroups: [UserGroup.GeneralHandler]
      })
      loginAndVisit("Supervisor", "/bichard/audit/search")
    })

    it("Should show search page with supervised users and visible triggers", () => {
      cy.findByText("Audit search").should("exist")

      cy.findByText("Resolved by").should("exist")
      cy.findByText("Supervisor User").should("exist")
      cy.findByText("username 01").should("exist")
      cy.findByText("username 02").should("exist")
      cy.findByText("username 03").should("exist")

      cy.findByText("Trigger type").should("exist")
      cy.findByText("TRPR0010").should("exist")
      cy.findByText("TRPR0006").should("not.exist")

      cy.findByText("Triggers").click()
      cy.findByText("All").click()

      cy.findByText("Search cases").click()

      cy.location("pathname").should("match", /\/bichard\/audit\/\d+/)
    })
  })

  context("When the user is not a supervisor", () => {
    before(() => {
      loginAndVisit("GeneralHandler", "/bichard/audit/search")
    })

    it("Should redirect to the case list", () => {
      cy.location("pathname").should("eq", "/bichard")
    })
  })
})
