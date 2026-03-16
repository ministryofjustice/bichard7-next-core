import { loginAndVisit } from "../support/helpers"
import HO100309 from "../../test/test-data/HO100309.json"

const buttonExists = () => cy.get("a.BichardSwitch").should("exist")
const buttonDoesNotExist = () => cy.get("a.BichardSwitch").should("not.exist")

describe("Switch Button", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1,
        hearingOutcome: HO100309.hearingOutcomeXml
      }
    ])
  })

  beforeEach(() => {
    cy.task("unlockCase", 0)
  })

  context("on the Case List page", () => {
    it("shows the switch button", () => {
      loginAndVisit("Supervisor", "/bichard")

      buttonExists()
    })

    context("with the feature flag enabled", () => {
      it("doesn't show the switch button", () => {
        loginAndVisit("SupervisorWithOnlyNewBichard", "/bichard")

        buttonDoesNotExist()
      })
    })
  })

  context("on the Audit page", () => {
    it("shows the switch button", () => {
      loginAndVisit("Supervisor", "/bichard/audit/search")

      buttonExists()
    })

    context("with the feature flag enabled", () => {
      it("doesn't show the switch button", () => {
        loginAndVisit("SupervisorWithOnlyNewBichard", "/bichard/audit/search")

        buttonDoesNotExist()
      })
    })
  })

  context("on the Case Details page", () => {
    it("shows the switch button", () => {
      loginAndVisit("Supervisor", "/bichard/court-cases/0")

      buttonExists()
    })

    context("with the feature flag enabled", () => {
      it("doesn't show the switch button", () => {
        loginAndVisit("SupervisorWithOnlyNewBichard", "/bichard/court-cases/0")

        buttonDoesNotExist()
      })
    })
  })

  context("on the Reallocate page", () => {
    it("doesn't show the switch button", () => {
      loginAndVisit("Supervisor", "/bichard/court-cases/0")
      cy.visit("/bichard/court-cases/0/reallocate")

      buttonDoesNotExist()
    })

    context("with the feature flag enabled", () => {
      it("doesn't show the switch button", () => {
        loginAndVisit("SupervisorWithOnlyNewBichard", "/bichard/court-cases/0")
        cy.visit("/bichard/court-cases/0/reallocate")

        buttonDoesNotExist()
      })
    })
  })

  context("on the Resolve page", () => {
    it("doesn't show the switch button", () => {
      loginAndVisit("Supervisor", "/bichard/court-cases/0/")
      cy.visit("/bichard/court-cases/0/resolve")

      buttonDoesNotExist()
    })

    context("with the feature flag enabled", () => {
      it("doesn't show the switch button", () => {
        loginAndVisit("SupervisorWithOnlyNewBichard", "/bichard/court-cases/0")
        cy.visit("/bichard/court-cases/0/resolve")

        buttonDoesNotExist()
      })
    })
  })

  context("on the Submit page", () => {
    it("doesn't show the switch button", () => {
      loginAndVisit("Supervisor", "/bichard/court-cases/0")
      cy.visit("/bichard/court-cases/0/submit")

      buttonDoesNotExist()
    })

    context("with the feature flag enabled", () => {
      it("doesn't show the switch button", () => {
        loginAndVisit("SupervisorWithOnlyNewBichard", "/bichard/court-cases/0")
        cy.visit("/bichard/court-cases/0/submit")

        buttonDoesNotExist()
      })
    })
  })

  context("on the Report Selection page", () => {
    it("doesn't show the switch button", () => {
      loginAndVisit("Supervisor", "/bichard/report-selection")

      buttonExists()
    })

    context("with the feature flag enabled", () => {
      it("doesn't show the switch button", () => {
        loginAndVisit("SupervisorWithOnlyNewBichard", "/bichard/report-selection")

        buttonDoesNotExist()
      })
    })
  })

  context("on the Feedback page", () => {
    it("doesn't show the switch button", () => {
      loginAndVisit("Supervisor", "/bichard/feedback?previousPath=/")

      buttonDoesNotExist()
    })

    context("with the feature flag enabled", () => {
      it("doesn't show the switch button", () => {
        loginAndVisit("SupervisorWithOnlyNewBichard", "/bichard/feedback?previousPath=/")

        buttonDoesNotExist()
      })
    })
  })

  context("on the Switching Feedback page", () => {
    it("doesn't show the switch button", () => {
      loginAndVisit(
        "Supervisor",
        "/bichard/switching-feedback?previousPath=%2F&redirectTo=..%2Fbichard-ui%2FRefreshListNoRedirect"
      )

      buttonDoesNotExist()
    })

    context("with the feature flag enabled", () => {
      it("doesn't show the switch button", () => {
        loginAndVisit(
          "SupervisorWithOnlyNewBichard",
          "/bichard/switching-feedback?previousPath=%2F&redirectTo=..%2Fbichard-ui%2FRefreshListNoRedirect"
        )

        buttonDoesNotExist()
      })
    })
  })
})
