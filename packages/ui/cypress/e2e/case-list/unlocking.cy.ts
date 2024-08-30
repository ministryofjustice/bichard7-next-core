import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { TestTrigger } from "../../../test/utils/manageTriggers"
import { loginAndVisit } from "../../support/helpers"

const unlockCase = (
  caseToUnlockNumber: number,
  caseToUnlockText: string,
  unlockTriggersOrExceptions: "Exceptions" | "Triggers"
) => {
  cy.get("tbody")
    .eq(caseToUnlockNumber - 1)
    .find(`tr${unlockTriggersOrExceptions === "Exceptions" ? ":first-child" : ":last-child"} .locked-by-tag`)
    .get("button")
    .contains(caseToUnlockText)
    .click()
  cy.get("button").contains("Unlock").click()
}

const checkLockStatus = (
  caseNumber: number,
  rowNumber: number,
  lockedByText: string,
  lockedByAssertion: [string, string | undefined],
  lockedTagAssertion: [string, string | undefined]
) => {
  if (lockedByText) {
    cy.get("tbody")
      .eq(caseNumber)
      .find(`tr:nth-child(${rowNumber}) .locked-by-tag`)
      .get("button")
      .contains(lockedByText)
      .should(...lockedByAssertion)
    cy.get("tbody")
      .eq(caseNumber)
      .find(`tr:nth-child(${rowNumber}) img[alt="Lock icon"]`)
      .should(...lockedTagAssertion)
  } else {
    cy.get("tbody")
      .eq(caseNumber)
      .find(`tr:nth-child(${rowNumber}) .locked-by-tag`)
      .should(...lockedByAssertion)
    cy.get("tbody")
      .eq(caseNumber)
      .find(`tr:nth-child(${rowNumber}) img[alt="Lock icon"]`)
      .should(...lockedTagAssertion)
  }
}

describe("Case unlocked badge", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should show case unlocked badge when exception handler unlocks the case", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: "ExceptionHandler",
        triggerLockedByUsername: null,
        orgForPoliceFilter: "011111",
        errorCount: 1,
        errorReport: "HO100310||ds:OffenceReasonSequence"
      }
    ])

    loginAndVisit("ExceptionHandler")

    cy.get("#defendantName").type("NAME Defendant")
    cy.contains("Apply filters").click()

    cy.get("button.locked-by-tag").contains("Exception Handler User").click()
    cy.get("#unlock").click()
    cy.get("span.moj-badge").contains("Case unlocked").should("exist")
  })

  it("Should show case unlocked badge when trigger handler unlocks the case", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        caseId: 0,
        errorLockedByUsername: null,
        triggerLockedByUsername: "TriggerHandler",
        orgForPoliceFilter: "011111",
        triggerCount: 1
      }
    ])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndVisit("TriggerHandler")

    cy.get("#defendantName").type("NAME Defendant")
    cy.contains("Apply filters").click()

    cy.get("button.locked-by-tag").contains("Trigger Handler User").click()
    cy.get("#unlock").click()
    cy.get("span.moj-badge").contains("Case unlocked").should("exist")
  })

  it("Should unlock a case that is locked to the user", () => {
    const lockUsernames = ["GeneralHandler", "BichardForce01"]
    cy.task(
      "insertCourtCasesWithFields",
      lockUsernames.map((username) => ({
        errorLockedByUsername: username,
        triggerLockedByUsername: username,
        orgForPoliceFilter: "011111",
        errorCount: 1,
        errorReport: "HO100310||ds:OffenceReasonSequence",
        triggerCount: 1
      }))
    )
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndVisit()

    // Exception lock
    checkLockStatus(0, 1, "General Handler", ["exist", undefined], ["exist", undefined])
    // Trigger lock
    checkLockStatus(0, 2, "General Handler", ["exist", undefined], ["exist", undefined])
    // User should not see unlock button when a case assigned to another user
    checkLockStatus(1, 1, "Bichard Test User Force 01", ["not.exist", undefined], ["exist", undefined])
    // Unlock the exception assigned to the user
    unlockCase(1, "General Handler", "Exceptions")
    checkLockStatus(0, 1, "", ["not.exist", undefined], ["not.exist", undefined])
    checkLockStatus(0, 2, "General Handler", ["exist", undefined], ["exist", undefined])
    checkLockStatus(1, 1, "", ["have.text", "Bichard Test User Force 01"], ["exist", undefined])
    // Unlock the trigger assigned to the user
    unlockCase(2, "General Handler", "Triggers")
    checkLockStatus(0, 2, "", ["not.exist", undefined], ["not.exist", undefined])
    checkLockStatus(1, 1, "", ["have.text", "Bichard Test User Force 01"], ["exist", undefined])
  })

  it("shows who has locked a case in the 'locked by' column", () => {
    const lockUsernames = ["BichardForce01", "BichardForce02", null, "A really really really long.name"]
    cy.task(
      "insertCourtCasesWithFields",
      lockUsernames.map((username) => ({
        errorLockedByUsername: username,
        triggerLockedByUsername: username,
        orgForPoliceFilter: "011111"
      }))
    )
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })
    cy.task("insertTriggers", { caseId: 1, triggers })
    cy.task("insertTriggers", { caseId: 2, triggers })
    cy.task("insertTriggers", { caseId: 3, triggers })

    loginAndVisit()

    checkLockStatus(0, 1, "", ["have.text", "Bichard Test User Force 01"], ["exist", undefined])
    cy.get("tbody").eq(0).find("tr:nth-child(2) td:nth-child(7)").should("contain.text", "PR01")
    checkLockStatus(1, 1, "", ["have.text", "Bichard Test User Force 02"], ["exist", undefined])
    cy.get("tbody").eq(1).find("tr:nth-child(2) td:nth-child(7)").should("contain.text", "PR01")
    checkLockStatus(2, 1, "", ["not.exist", undefined], ["not.exist", undefined])
    cy.get("tbody").eq(2).find(`tr:nth-child(2) td:nth-child(7)`).should("contain.text", "PR01")
    checkLockStatus(3, 1, "", ["have.text", "A Really Really Really Long Name User"], ["exist", undefined])
    cy.get("tbody").eq(3).find(`tr:nth-child(2) td:nth-child(7)`).should("contain.text", "PR01")
  })

  it("Should unlock any case as a supervisor user", () => {
    const lockUsernames = ["BichardForce01", "BichardForce02"]
    cy.task(
      "insertCourtCasesWithFields",
      lockUsernames.map((username) => ({
        errorLockedByUsername: username,
        triggerLockedByUsername: username,
        orgForPoliceFilter: "011111",
        errorCount: 1,
        errorReport: "HO100310||ds:OffenceReasonSequence",
        triggerCount: 1
      }))
    )

    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndVisit("Supervisor")
    checkLockStatus(0, 1, "Bichard Test User Force 01", ["exist", undefined], ["exist", undefined])
    checkLockStatus(0, 2, "Bichard Test User Force 01", ["exist", undefined], ["exist", undefined])
    checkLockStatus(1, 1, "Bichard Test User Force 01", ["exist", undefined], ["exist", undefined])

    // Unlock both cases
    unlockCase(1, "Bichard Test User Force 01", "Exceptions")
    unlockCase(1, "Bichard Test User Force 01", "Triggers")
    unlockCase(2, "Bichard Test User Force 02", "Exceptions")

    checkLockStatus(0, 1, "", ["not.exist", undefined], ["not.exist", undefined])
    checkLockStatus(0, 2, "", ["not.exist", undefined], ["not.exist", undefined])
    checkLockStatus(1, 1, "", ["not.exist", undefined], ["not.exist", undefined])
  })
})
