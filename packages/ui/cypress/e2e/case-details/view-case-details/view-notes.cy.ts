import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import CourtCase from "../../../../src/services/entities/CourtCase"
import type { TestTrigger } from "../../../../test/utils/manageTriggers"
import a11yConfig from "../../../support/a11yConfig"
import { clickTab, loginAndVisit } from "../../../support/helpers"
import logAccessibilityViolations from "../../../support/logAccessibilityViolations"

const loginAndGoToNotes = () => {
  loginAndVisit("/bichard/court-cases/0")
  cy.contains("Notes").click()
}

const trigger: TestTrigger = {
  triggerId: 0,
  triggerCode: TriggerCode.TRPR0001,
  status: "Unresolved",
  createdAt: new Date("2022-07-09T10:22:34.000Z")
}

const exception = {
  caseId: 0,
  exceptionCode: "HO100310",
  errorReport: "HO100310||ds:OffenceReasonSequence"
}

const insertCaseWithTriggerAndException = (courtCase?: Partial<CourtCase>) => {
  cy.task("insertCourtCasesWithFields", [
    courtCase ?? {
      orgForPoliceFilter: "01"
    }
  ])
  cy.task("insertTriggers", { caseId: 0, triggers: [trigger] })
  cy.task("insertException", exception)
}

describe("View notes", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should be accessible", () => {
    insertCaseWithTriggerAndException()
    loginAndGoToNotes()

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should display all notes by default", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          { user: "GeneralHandler", text: "Test note 1" },
          { user: "System", text: "Test note 2" }
        ]
      ],
      force: "01"
    })

    loginAndGoToNotes()

    cy.contains("General Handler User")
    cy.contains("Test note 1")
    cy.contains("System")
    cy.contains("Test note 2")
  })

  it("Should display system and user notes", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          { user: "GeneralHandler", text: "Test note 1" },
          { user: "System", text: "Test note 2" }
        ]
      ],
      force: "01"
    })

    loginAndGoToNotes()

    cy.findByText("View system notes").click()
    cy.should("not.contain", "General Handler User")
    cy.should("not.contain", "Test note 1")
    cy.contains("System")
    cy.contains("Test note 2")

    cy.findByText("View user notes").click()
    cy.should("not.contain", "System")
    cy.should("not.contain", "Test note 2")
    cy.contains("General Handler User")
    cy.contains("Test note 1")
  })

  it("Should display no user notes message", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [[{ user: "System", text: "Test note 2" }]],
      force: "01"
    })

    loginAndGoToNotes()
    cy.findByText("View user notes").click()

    cy.should("not.contain", "System")
    cy.should("not.contain", "Test note 2")
    cy.contains("Case has no user notes.")
  })

  it("Should display no system notes message", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [[{ user: "GeneralHandler", text: "Test note 1" }]],
      force: "01"
    })

    loginAndGoToNotes()
    cy.findByText("View system notes").click()

    cy.should("not.contain", "General Handler User")
    cy.should("not.contain", "Test note 1")
    cy.contains("Case has no system notes.")
  })

  it("Should display no notes message", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [[]],
      force: "01"
    })

    loginAndGoToNotes()
    cy.contains("Case has no notes.")
  })

  it("Should not display the notes text area if the case is locked to another users", () => {
    cy.task("insertCourtCasesWithNotesAndLock", {
      caseNotes: [[]],
      force: "01"
    })

    loginAndGoToNotes()
    cy.contains("Case has no notes.")
    cy.get("#note-text").should("not.exist")
    cy.get("#add-note-button").should("not.exist")
  })

  it("Should display the notes text area if the case is locked by the user", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [[]],
      force: "01"
    })
    cy.task("insertException", exception)

    loginAndGoToNotes()
    cy.get("label").contains("Add a new note")
    cy.get("textarea").should("be.visible")
    cy.get("span").contains("You have 2000 characters remaining")
  })

  it("Should be able to add a note when case is visible to the user and not locked by another user", () => {
    insertCaseWithTriggerAndException()
    loginAndGoToNotes()
    cy.get("textarea").type("Dummy note")
    cy.get("button").contains("Add note").click()

    clickTab("Notes")

    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Dummy note")
  })

  it("Should be able to add a note when case is visible to the user and error locked by another user", () => {
    insertCaseWithTriggerAndException({ orgForPoliceFilter: "01", errorLockedByUsername: "BichardForce01" })
    loginAndGoToNotes()
    cy.get("textarea").type("Dummy note")
    cy.get("button").contains("Add note").click()

    clickTab("Notes")

    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Dummy note")
  })

  it("Should be able to add a note when case is visible to the user and trigger locked by another user", () => {
    insertCaseWithTriggerAndException({ orgForPoliceFilter: "01", triggerLockedByUsername: "BichardForce01" })
    loginAndGoToNotes()
    cy.get("textarea").type("Dummy note")
    cy.get("button").contains("Add note").click()

    clickTab("Notes")

    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Dummy note")
  })

  it("Should be able to add a long note", () => {
    insertCaseWithTriggerAndException()
    loginAndGoToNotes()
    cy.contains("h3", "Notes")

    cy.get("textarea").type("A ".repeat(500), { delay: 0 })
    cy.get("button").contains("Add note").click()

    clickTab("Notes")

    cy.get("textarea").type("B ".repeat(500), { delay: 0 })
    cy.get("button").contains("Add note").click()

    clickTab("Notes")

    cy.get("textarea").type("C ".repeat(100), { delay: 0 })
    cy.get("button").contains("Add note").click()

    clickTab("Notes")

    cy.contains("A ".repeat(500))
    cy.contains("B ".repeat(500))
    cy.contains("C ".repeat(100))
  })

  it("Should show error message when note text is empty", () => {
    insertCaseWithTriggerAndException()
    loginAndGoToNotes()

    cy.get("H3").contains("Notes")
    cy.get("button").contains("Add note").click()
    cy.get("form span").contains("The note cannot be empty")
    cy.get("textarea[name=noteText]").type("dummy note")
    cy.get("form span").should("not.contain", "The note cannot be empty")
    cy.get("button").contains("Add note").click()

    cy.contains("dummy note")
  })

  it("Adding an empty note doesn't add a note, when the case is visible to the user and not locked by another user", () => {
    insertCaseWithTriggerAndException()
    loginAndGoToNotes()

    cy.url().should("match", /.*\/court-cases\/0/)
    clickTab("Notes")
    cy.findByText("Case has no notes.").should("exist")
  })
})

export {}
