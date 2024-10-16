import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { loginAndVisit } from "../../support/helpers"

const insertTrigger = (status = "Unresolved") => {
  cy.task("insertTriggers", {
    caseId: 0,
    triggers: [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status,
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
  })
}

describe("Lock court cases", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should lock a case when a user views a case details page", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1
      }
    ])
    insertTrigger()

    loginAndVisit()

    cy.contains("a", "NAME Defendant").click()

    cy.get(".view-only-badge").should("not.exist")
    cy.get(".triggers-locked-tag").should("exist")
    cy.get("#triggers-locked-tag-lockee").should("contain.text", "Locked to you")
    cy.get(".exceptions-locked-tag").should("exist")
    cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Locked to you")
  })

  it("should not lock a case that is already locked to another user", () => {
    const existingUserLock = "BichardForce04"
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: existingUserLock,
        triggerLockedByUsername: existingUserLock,
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1
      }
    ])

    loginAndVisit()
    cy.findByText("NAME Defendant").click()

    cy.get(".view-only-badge").should("exist")
    cy.get(".triggers-locked-tag").should("exist")
    cy.get("#triggers-locked-tag-lockee").should("contain.text", "Bichard Test User Force 04")
    cy.get(".exceptions-locked-tag").should("exist")
    cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Bichard Test User Force 04")
  })

  it("should not lock exceptions when a trigger handler clicks into a case", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1
      }
    ])
    insertTrigger()

    loginAndVisit("TriggerHandler")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()

    cy.get(".exceptions-locked-tag").should("not.exist")
  })

  it("should only lock exceptions on an unlocked case if triggers are already resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01",
        errorCount: 1,
        errorStatus: "Unresolved",
        triggerCount: 1,
        triggerStatus: "Resolved"
      }
    ])

    loginAndVisit()
    cy.findByText("NAME Defendant").click()

    cy.get(".triggers-resolved-tag").should("exist").should("contain.text", "Resolved")
    cy.get(".triggers-locked-tag").should("not.exist")
    cy.get("#exceptions-locked-tag-lockee").should("exist")
    cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Locked to you")
  })

  it("should only lock triggers on an unlocked case if exceptions are already resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01",
        errorCount: 1,
        errorStatus: "Resolved",
        triggerCount: 1,
        triggerStatus: "Unresolved"
      }
    ])

    loginAndVisit()
    cy.findByText("NAME Defendant").click()

    cy.get(".exceptions-resolved-tag").should("exist").should("contain.text", "Resolved")
    cy.get(".exceptions-locked-tag").should("not.exist")
    cy.get(".triggers-locked-tag").should("exist")
    cy.get("#triggers-locked-tag-lockee").should("contain.text", "Locked to you")
  })

  it("shouldn't lock exceptions on an unlocked case if exceptions are submitted", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01",
        errorCount: 1,
        errorStatus: "Submitted",
        triggerCount: 1,
        triggerStatus: "Unresolved"
      }
    ])

    loginAndVisit()
    cy.findByText("NAME Defendant").click()

    cy.get(".exceptions-submitted-tag").should("exist").should("contain.text", "Submitted")
    cy.get(".exceptions-locked-tag").should("not.exist")
    cy.get(".triggers-resolved-tag").should("not.exist")
    cy.get("#triggers-locked-tag-lockee").should("contain.text", "Locked to you")
  })

  it("shouldn't lock exceptions or triggers on an unlocked case if exceptions are submitted and triggers are resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01",
        errorCount: 1,
        errorStatus: "Submitted",
        triggerCount: 1,
        triggerStatus: "Resolved"
      }
    ])
    insertTrigger("Resolved")

    loginAndVisit()
    cy.findByText("NAME Defendant").click()

    cy.get(".exceptions-submitted-tag").should("exist").should("contain.text", "Submitted")
    cy.get(".exceptions-locked-tag").should("not.exist")
    cy.get(".triggers-resolved-tag").should("exist").should("contain.text", "Resolved")
    cy.get(".triggers-locked-tag").should("not.exist")
  })

  it("shouldn't lock either triggers nor exceptions on an unlocked case if both are already resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01",
        errorCount: 1,
        errorStatus: "Resolved",
        triggerCount: 1,
        triggerStatus: "Resolved"
      }
    ])
    insertTrigger("Resolved")

    loginAndVisit("/bichard/court-cases/0")

    cy.get(".exceptions-resolved-tag").should("exist").should("contain.text", "Resolved")
    cy.get(".exceptions-locked-tag").should("not.exist")
    cy.get(".triggers-resolved-tag").should("exist").should("contain.text", "Resolved")
    cy.get(".triggers-locked-tag").should("not.exist")
  })
})

export {}
