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
          orgForPoliceFilter: "01",
          hearingOutcome: resolvedAsnAho.hearingOutcomeXml,
          updatedHearingOutcome: resolvedAsnAho.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorStatus: "Resolved",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          errorReason: "HO100321",
          errorResolvedTimestamp: new Date(),
          errorResolvedBy: "GeneralHandler",
          resolutionTimestamp: new Date(),
          defendantName: "WAYNE Bruce"
        },
        {
          orgForPoliceFilter: "01",
          hearingOutcome: unresolvedAsnAho.hearingOutcomeXml,
          updatedHearingOutcome: unresolvedAsnAho.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          errorReason: "HO100321",
          defendantName: "GORDON Barbara"
        }
      ])

      const trigger1: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: TriggerCode.TRPR0017,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      const trigger2: TestTrigger[] = [
        {
          triggerId: 1,
          triggerCode: TriggerCode.TRPR0017,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
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
          orgForPoliceFilter: "01",
          hearingOutcome: resolvedAsnAho.hearingOutcomeXml,
          updatedHearingOutcome: resolvedAsnAho.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorStatus: "Resolved",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          errorReason: "HO100321",
          errorResolvedTimestamp: new Date(),
          errorResolvedBy: "GeneralHandler",
          triggerResolvedBy: "GeneralHandler",
          triggerResolvedTimestamp: new Date(),
          resolutionTimestamp: new Date(),
          defendantName: "WAYNE Bruce"
        },
        {
          orgForPoliceFilter: "01",
          hearingOutcome: unresolvedAsnAho.hearingOutcomeXml,
          updatedHearingOutcome: unresolvedAsnAho.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          errorReason: "HO100321",
          defendantName: "GORDON Barbara"
        }
      ])

      const trigger1: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: TriggerCode.TRPR0017,
          status: "Resolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      const trigger2: TestTrigger[] = [
        {
          triggerId: 1,
          triggerCode: TriggerCode.TRPR0017,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
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
