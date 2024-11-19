import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import { TestTrigger } from "../../../../test/utils/manageTriggers"
import resolvedAsnAho from "../../../fixtures/resolvedAsnAho.json"
import unresolvedAsnAho from "../../../fixtures/unResolvedAsnAho.json"
import { confirmFiltersAppliedContains } from "../../../support/helpers"

// This test relies on unresolved triggers for filtering by exceptions/triggers
describe("filterCasesWithExceptionsAndTriggers", () => {
  before(() => {
    cy.task("clearCourtCases")
  })

  beforeEach(() => {
    cy.loginAs("GeneralHandler")
  })

  describe("For exceptions filtering", () => {
    before(() => {
      cy.task("insertCourtCasesWithFields", [
        {
          defendantName: "WAYNE Bruce",
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorReason: "HO100321",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          errorResolvedBy: "GeneralHandler",
          errorResolvedTimestamp: new Date(),
          errorStatus: "Resolved",
          hearingOutcome: resolvedAsnAho.hearingOutcomeXml,
          orgForPoliceFilter: "01",
          resolutionTimestamp: new Date(),
          updatedHearingOutcome: resolvedAsnAho.hearingOutcomeXml
        },
        {
          defendantName: "GORDON Barbara",
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorReason: "HO100321",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          hearingOutcome: unresolvedAsnAho.hearingOutcomeXml,
          orgForPoliceFilter: "01",
          updatedHearingOutcome: unresolvedAsnAho.hearingOutcomeXml
        }
      ])

      const trigger1: TestTrigger[] = [
        {
          createdAt: new Date("2022-07-09T10:22:34.000Z"),
          status: "Unresolved",
          triggerCode: TriggerCode.TRPR0017,
          triggerId: 0
        }
      ]
      const trigger2: TestTrigger[] = [
        {
          createdAt: new Date("2022-07-09T10:22:34.000Z"),
          status: "Unresolved",
          triggerCode: TriggerCode.TRPR0017,
          triggerId: 1
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers: trigger1 })
      cy.task("insertTriggers", { caseId: 1, triggers: trigger2 })
    })

    it("only finds one case when searching for exception HO100321", () => {
      cy.visit("/bichard")

      cy.get("input#reasonCodes").type("HO100321")
      cy.get("button#search").click()

      confirmFiltersAppliedContains("HO100321")

      cy.get(".cases-list tbody").should("have.length", 1)
      cy.get(".cases-list tbody").contains("GORDON Barbara")
    })

    it("only finds one case when searching for resolved exception HO100321", () => {
      cy.visit("/bichard")

      cy.get("input#reasonCodes").type("HO100321")
      cy.get("label[for=resolved]").click()
      cy.get("button#search").click()

      confirmFiltersAppliedContains("HO100321")
      confirmFiltersAppliedContains("Resolved")

      cy.get(".cases-list tbody").should("have.length", 1)
      cy.get(".cases-list tbody").contains("WAYNE Bruce")
    })
  })

  describe("For trigger filtering", () => {
    before(() => {
      cy.task("insertCourtCasesWithFields", [
        {
          defendantName: "WAYNE Bruce",
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorReason: "HO100321",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          errorResolvedBy: "GeneralHandler",
          errorResolvedTimestamp: new Date(),
          errorStatus: "Resolved",
          hearingOutcome: resolvedAsnAho.hearingOutcomeXml,
          orgForPoliceFilter: "01",
          resolutionTimestamp: new Date(),
          triggerResolvedBy: "GeneralHandler",
          triggerResolvedTimestamp: new Date(),
          updatedHearingOutcome: resolvedAsnAho.hearingOutcomeXml
        },
        {
          defendantName: "GORDON Barbara",
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorReason: "HO100321",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          hearingOutcome: unresolvedAsnAho.hearingOutcomeXml,
          orgForPoliceFilter: "01",
          updatedHearingOutcome: unresolvedAsnAho.hearingOutcomeXml
        }
      ])

      const trigger1: TestTrigger[] = [
        {
          createdAt: new Date("2022-07-09T10:22:34.000Z"),
          status: "Resolved",
          triggerCode: TriggerCode.TRPR0017,
          triggerId: 0
        }
      ]
      const trigger2: TestTrigger[] = [
        {
          createdAt: new Date("2022-07-09T10:22:34.000Z"),
          status: "Unresolved",
          triggerCode: TriggerCode.TRPR0017,
          triggerId: 1
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers: trigger1 })
      cy.task("insertTriggers", { caseId: 1, triggers: trigger2 })
    })

    it("only finds one case when searching for trigger TRPR0017", () => {
      cy.visit("/bichard")

      cy.get("input#reasonCodes").type("TRPR0017")
      cy.get("button#search").click()

      confirmFiltersAppliedContains("TRPR0017")

      cy.get(".cases-list tbody").should("have.length", 1)
      cy.get(".cases-list tbody").contains("GORDON Barbara")
    })

    it("only finds one case when searching for resolved trigger TRPR0017", () => {
      cy.visit("/bichard")

      cy.get("input#reasonCodes").type("TRPR0017")
      cy.get("label[for=resolved]").click()
      cy.get("button#search").click()

      confirmFiltersAppliedContains("TRPR0017")
      confirmFiltersAppliedContains("Resolved")

      cy.get(".cases-list tbody").should("have.length", 1)
      cy.get(".cases-list tbody").contains("WAYNE Bruce")
    })
  })
})
