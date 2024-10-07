import { subHours } from "date-fns"
import CourtCase from "services/entities/CourtCase"
import { confirmMultipleFieldsDisplayed, confirmMultipleFieldsNotDisplayed, loginAndVisit } from "../../support/helpers"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

describe("Only shows relevant resolved cases to the user", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("shows supervisors all resolved cases from their force", () => {
    const casesConfig = [
      { force: "011111", resolved: true },
      { force: "011111", resolved: true },
      { force: "011111", resolved: false },
      { force: "02", resolved: true },
      { force: "03", resolved: false },
      { force: "011111", resolved: false }
    ]
    const cases: Partial<CourtCase>[] = casesConfig.map((caseConfig, index) => {
      const resolutionDate = subHours(new Date(), Math.random() * 100)
      return {
        errorId: index,
        orgForPoliceFilter: caseConfig.force,
        resolutionTimestamp: caseConfig.resolved ? resolutionDate : null,
        errorResolvedTimestamp: caseConfig.resolved ? resolutionDate : null,
        errorStatus: caseConfig.resolved ? "Resolved" : "Unresolved",
        errorCount: 1
      }
    })
    cy.task("insertCourtCasesWithFields", cases)

    loginAndVisit("Supervisor")

    confirmMultipleFieldsDisplayed(["Case00002", "Case00005"])
    confirmMultipleFieldsNotDisplayed(["Case00000", "Case00001", "Case00003", "Case00004"])

    cy.get(`label[for="resolved"]`).click()
    cy.get("#search").click()

    confirmMultipleFieldsDisplayed(["Case00000", "Case00001"])
    confirmMultipleFieldsNotDisplayed(["Case00002", "Case00003", "Case00004", "Case00005"])
  })

  it("shows handlers resolved cases that only they resolved exceptions for", () => {
    const casesConfig = [
      { force: "011111", resolved: true, resolvedBy: "Supervisor" },
      { force: "011111", resolved: true, resolvedBy: "GeneralHandler" },
      { force: "011111", resolved: false },
      { force: "02", resolved: true, resolvedBy: "BichardForce02" },
      { force: "03", resolved: false },
      { force: "011111", resolved: false },
      { force: "011111", resolved: true, resolvedBy: "GeneralHandler" }
    ]
    const cases: Partial<CourtCase>[] = casesConfig.map((caseConfig, errorId) => {
      const resolutionDate = subHours(new Date(), Math.random() * 100)
      return {
        errorId,
        orgForPoliceFilter: caseConfig.force,
        resolutionTimestamp: caseConfig.resolved ? resolutionDate : null,
        errorCount: 1,
        errorResolvedTimestamp: caseConfig.resolved ? resolutionDate : null,
        errorStatus: caseConfig.resolved ? "Resolved" : "Unresolved",
        errorResolvedBy: caseConfig.resolvedBy ?? null
      }
    })
    cy.task("insertCourtCasesWithFields", cases)

    loginAndVisit()

    cy.get(`label[for="resolved"]`).click()
    cy.get("#search").click()

    confirmMultipleFieldsDisplayed(["Case00001", "Case00006"])
    confirmMultipleFieldsNotDisplayed(["Case00000", "Case00002", "Case00003", "Case00004", "Case00005"])
  })

  it("shows handlers resolved cases that only they resolved triggers for", () => {
    const casesConfig = [
      { force: "01", resolved: true, resolvedBy: "Supervisor" },
      { force: "01", resolved: true, resolvedBy: "GeneralHandler" },
      { force: "01", resolved: false },
      { force: "02", resolved: true, resolvedBy: "BichardForce02" },
      { force: "03", resolved: false },
      { force: "01", resolved: false },
      { force: "01", resolved: true, resolvedBy: "GeneralHandler" }
    ]
    const cases: Partial<CourtCase>[] = casesConfig.map((caseConfig, errorId) => {
      const resolutionDate = subHours(new Date(), Math.random() * 100)
      return {
        errorId,
        orgForPoliceFilter: caseConfig.force,
        resolutionTimestamp: caseConfig.resolved ? resolutionDate : null,
        triggerCount: 1,
        triggerResolvedTimestamp: caseConfig.resolved ? resolutionDate : null,
        triggerStatus: caseConfig.resolved ? "Resolved" : "Unresolved",
        triggerResolvedBy: caseConfig.resolvedBy ?? null
      }
    })
    cy.task("insertCourtCasesWithFields", cases)

    cases
      .filter((c) => !!c.triggerResolvedBy)
      .forEach((caseConfig) => {
        cy.task("insertTriggers", {
          caseId: caseConfig.errorId,
          triggers: [
            {
              triggerCode: TriggerCode.TRPR0010,
              status: "Resolved",
              createdAt: new Date("2023-03-07T10:22:34.000Z"),
              resolvedBy: caseConfig.triggerResolvedBy,
              resolvedAt: new Date("2023-03-07T12:22:34.000Z")
            }
          ]
        })
      })

    loginAndVisit()

    cy.get(`label[for="resolved"]`).click()
    cy.get("#search").click()

    confirmMultipleFieldsDisplayed(["Case00001", "Case00006"])
    confirmMultipleFieldsNotDisplayed(["Case00000", "Case00002", "Case00003", "Case00004", "Case00005"])
  })
})
