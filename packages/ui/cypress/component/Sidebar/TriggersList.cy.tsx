import { DisplayTrigger } from "types/display/Triggers"
import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"
import React from "react"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import TriggersList from "features/CourtCaseDetails/Sidebar/TriggersList"
import { mount } from "cypress/react"
import { MockNextRouter } from "../../support/MockNextRouter"
import { PreviousPathContext } from "context/PreviousPathContext"
import { CsrfTokenContext } from "context/CsrfTokenContext"
import { CurrentUserContext } from "context/CurrentUserContext"
import { CourtCaseContext } from "context/CourtCaseContext"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import "../../../styles/globals.scss"

const currentUser = { username: "test-user" } as DisplayFullUser

const buildTrigger = (overrides: Partial<DisplayTrigger> = {}): DisplayTrigger => ({
  triggerId: 1,
  triggerCode: TriggerCode.TRPR0001,
  triggerItemIdentity: 0,
  status: ResolutionStatus.Unresolved,
  description: null,
  shortTriggerCode: "PR01",
  createdAt: "2024",
  ...overrides
})

const buildCourtCase = (overrides: Record<string, unknown> = {}) => ({
  errorId: 42,
  triggers: [] as DisplayTrigger[],
  triggerStatus: null,
  triggerLockedByUsername: null,
  errorStatus: ResolutionStatus.Unresolved,
  ...overrides
})

function mountTriggersList(
  courtCaseOverrides: Record<string, unknown> = {},
  options: {
    username?: string
    triggersLockedByAnotherUser?: boolean
    onNavigate?: Cypress.Agent<sinon.SinonStub>
  } = {}
) {
  const courtCase = buildCourtCase(courtCaseOverrides) as DisplayFullCourtCase
  const onNavigate = options.onNavigate ?? cy.stub().as("onNavigate")

  if (options.triggersLockedByAnotherUser) {
    courtCase.triggerLockedByUsername = "some.user"
  }

  mount(
    <MockNextRouter basePath={"/bichard"}>
      <PreviousPathContext.Provider value={{ previousPath: "test" }}>
        <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
          <CurrentUserContext.Provider value={{ currentUser }}>
            <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
              <TriggersList onNavigate={onNavigate} />
            </CourtCaseContext.Provider>
          </CurrentUserContext.Provider>
        </CsrfTokenContext.Provider>
      </PreviousPathContext.Provider>
    </MockNextRouter>
  )
}

describe("TriggersList", () => {
  describe("when there are no triggers", () => {
    beforeEach(() => {
      mountTriggersList({ triggers: [] })
    })

    it("displays the no-triggers message", () => {
      cy.contains("There are no triggers for this case.").should("be.visible")
    })

    it("does not render the Select all link", () => {
      cy.get("#select-all-action").should("not.exist")
    })

    it("does not render the Mark trigger(s) as complete button", () => {
      cy.get("#mark-triggers-complete-button").should("not.exist")
    })

    it("does not render a LockStatusTag", () => {
      cy.get("#triggers-locked-tag-lockee").should("not.exist")
    })
  })

  describe("when there are unresolved triggers not locked by another user", () => {
    const triggers = [
      buildTrigger({ triggerId: 1, triggerItemIdentity: 0, status: "Unresolved" }),
      buildTrigger({ triggerId: 2, triggerItemIdentity: 1, status: "Unresolved" })
    ]

    beforeEach(() => {
      mountTriggersList({ triggers, triggerStatus: ResolutionStatus.Unresolved })
    })

    it("renders all triggers", () => {
      cy.get(".trigger-rows").children().should("have.length", 2)
    })

    it("renders the Select all link", () => {
      cy.get("#select-all-action").should("be.visible")
    })

    it("renders the Mark trigger(s) as complete button in a disabled state by default", () => {
      cy.get("#mark-triggers-complete-button").should("be.visible").and("be.disabled")
    })

    it("enables the submit button once a trigger is selected", () => {
      cy.get(`input[type='checkbox'][value='1']`).check()
      cy.get("#mark-triggers-complete-button").should("not.be.disabled")
    })

    it("Select all selects every unresolved trigger", () => {
      cy.get("#select-all-action").click()
      cy.get(`input[type='checkbox'][value='1']`).should("be.checked")
      cy.get(`input[type='checkbox'][value='2']`).should("be.checked")
    })

    it("enables the submit button after selecting all", () => {
      cy.get("#select-all-action").click()
      cy.get("#mark-triggers-complete-button").should("not.be.disabled")
    })

    it("deselecting a trigger removes it from the selection", () => {
      cy.get("#select-all-action").click()
      cy.get(`input[type='checkbox'][value='1']`).uncheck()
      cy.get(`input[type='checkbox'][value='1']`).should("not.be.checked")
      cy.get(`input[type='checkbox'][value='2']`).should("be.checked")
    })

    it("renders the LockStatusTag", () => {
      cy.get("#triggers-locked-tag-lockee").should("exist")
    })
  })

  describe("when triggers have mixed resolution statuses", () => {
    const triggers = [
      buildTrigger({ triggerId: 1, status: "Unresolved" }),
      buildTrigger({ triggerId: 2, status: "Resolved" })
    ]

    it("Select all only selects unresolved triggers", () => {
      mountTriggersList({ triggers })
      cy.get("#select-all-action").click()
      cy.get(`input[type='checkbox'][value='1']`).should("be.checked")
      cy.get(`input[type='checkbox'][value='2']`).should("not.exist")
      cy.get(".moj-badge").contains("Complete")
    })

    it("does not render the Select all link when all triggers are resolved", () => {
      mountTriggersList({
        triggers: [buildTrigger({ triggerId: 1, status: "Resolved" })]
      })
      cy.get("#select-all-action").should("not.exist")
    })
  })

  describe("when triggers are locked by another user", () => {
    const triggers = [buildTrigger({ triggerId: 1, status: "Unresolved" })]

    beforeEach(() => {
      mountTriggersList({ triggers, triggerStatus: ResolutionStatus.Unresolved }, { triggersLockedByAnotherUser: true })
    })

    it("does not render the Select all link", () => {
      cy.get("#select-all-action").should("not.exist")
    })

    it("does not render the Mark trigger(s) as complete button", () => {
      cy.get("#mark-triggers-complete-button").should("not.exist")
    })

    it("renders triggers in a disabled state", () => {
      cy.get(".trigger-rows input[type='checkbox']").should("not.exist")
    })

    it("still renders the LockStatusTag", () => {
      cy.get("#triggers-locked-tag-lockee").should("exist")
    })
  })

  describe("when the case error status is Submitted", () => {
    const triggers = [buildTrigger({ triggerId: 1, status: "Unresolved" })]

    it("renders triggers as disabled", () => {
      mountTriggersList({ triggers, errorStatus: ResolutionStatus.Submitted })
      cy.get(".trigger-rows input[type='checkbox']").should("not.exist")
    })
  })

  describe("trigger ordering", () => {
    it("renders triggers sorted by triggerItemIdentity ascending", () => {
      const triggers = [
        buildTrigger({ triggerId: 3, triggerItemIdentity: 2 }),
        buildTrigger({ triggerId: 1, triggerItemIdentity: 0 }),
        buildTrigger({ triggerId: 2, triggerItemIdentity: 1 })
      ]
      mountTriggersList({ triggers })

      cy.get(".trigger-rows input[type='checkbox']").then(($checkboxes) => {
        const values = [...$checkboxes].map((el) => el.getAttribute("value"))
        expect(values).to.deep.equal(["1", "2", "3"])
      })
    })
  })

  describe("navigation", () => {
    it("calls onNavigate with the correct offenceOrderIndex when a trigger is clicked", () => {
      const onNavigate = cy.stub().as("onNavigate")
      const triggers = [buildTrigger({ triggerId: 1, triggerItemIdentity: 3 })]
      mountTriggersList({ triggers }, { onNavigate })

      cy.get(".trigger-details-column .moj-action-link").first().click()
      cy.get("@onNavigate").should("have.been.calledOnceWith", {
        location: "Case Details > Offences",
        args: { offenceOrderIndex: 3 }
      })
    })
  })

  describe("form submission", () => {
    const triggers = [
      buildTrigger({ triggerId: 1, status: "Unresolved" }),
      buildTrigger({ triggerId: 2, status: "Unresolved" })
    ]

    it("disables the submit button after the form is submitted to prevent double-submission", () => {
      mountTriggersList({ triggers })

      cy.get("form").then(($form) => {
        $form.on("submit", (e) => e.preventDefault())
      })

      cy.get(`input[type='checkbox'][value='1']`).check()
      cy.get("#mark-triggers-complete-button").click()
      cy.get("#mark-triggers-complete-button").should("be.disabled")
    })

    it("encodes selected trigger IDs in the form action URL", () => {
      mountTriggersList({ triggers })
      cy.get(`input[type='checkbox'][value='1']`).check()

      cy.get("form").should("have.attr", "action").and("include", "resolveTrigger=1")
    })

    it("encodes multiple trigger IDs when several are selected", () => {
      mountTriggersList({ triggers })
      cy.get("#select-all-action").click()

      cy.get("form").should("have.attr", "action").and("include", "resolveTrigger=1").and("include", "resolveTrigger=2")
    })
  })
})
