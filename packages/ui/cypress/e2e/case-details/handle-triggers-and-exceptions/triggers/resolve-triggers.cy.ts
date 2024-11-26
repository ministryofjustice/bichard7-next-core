import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { ResolutionStatus } from "types/ResolutionStatus"
import { TestTrigger } from "../../../../../test/utils/manageTriggers"
import { caseURL } from "../../../../fixtures/triggers"
import { clickTab } from "../../../../support/helpers"

const createCasesWithTriggers = () => {
  const caseTriggers: Partial<TestTrigger>[] = [
    {
      triggerCode: TriggerCode.TRPR0001,
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    },
    {
      triggerCode: TriggerCode.TRPR0002,
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
  ]

  cy.task("insertCourtCasesWithFields", [
    {
      triggerLockedByUsername: "GeneralHandler",
      orgForPoliceFilter: "01",
      errorStatus: "Resolved"
    }
  ])
  cy.task("insertTriggers", { caseId: 0, triggers: caseTriggers })
}

describe("Resolve triggers", () => {
  beforeEach(() => {
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })

  it("Should be able to resolve a trigger and redirect to case list when all triggers resolved and exceptions resolved", () => {
    createCasesWithTriggers()

    cy.visit(caseURL)

    cy.get(".trigger-header input[type='checkbox']").first().check()
    cy.get("#mark-triggers-complete-button").click()

    cy.url().should("match", /\/court-cases\/\d+/)
    cy.get("span.moj-badge--green").eq(0).should("have.text", "Complete")

    cy.get(".trigger-header input[type='checkbox']").check()
    cy.get("#mark-triggers-complete-button").click()

    cy.url().should("match", /\/bichard$/)
    cy.visit(caseURL)
    cy.get("span.moj-badge--green").eq(0).should("have.text", "Complete")
    cy.get("span.moj-badge--green").eq(1).should("have.text", "Complete")
  })

  it("Should be able to create notes as triggers get resolved", () => {
    createCasesWithTriggers()

    cy.visit(caseURL)

    cy.get(".trigger-header input[type='checkbox']").first().check()
    cy.screenshot()
    cy.get("#mark-triggers-complete-button").click()

    clickTab("Notes")

    cy.get("td").contains(`GeneralHandler: Portal Action: Resolved Trigger. Code: PR01`)

    cy.get(".trigger-header input[type='checkbox']").check()
    cy.get("#mark-triggers-complete-button").click()

    cy.url().should("match", /\/bichard$/)
    cy.visit(caseURL)

    clickTab("Notes")

    cy.get("td").contains(`GeneralHandler: Portal Action: Resolved Trigger. Code: PR02`)
  })

  it("Should be able to resolve all triggers on a case using 'select all' if all are unresolved and create notes", () => {
    const caseTriggers: { code: string; status: ResolutionStatus }[][] = [
      [
        {
          code: "TRPR0001",
          status: "Unresolved"
        },
        {
          code: "TRPR0002",
          status: "Unresolved"
        },
        {
          code: "TRPR0003",
          status: "Unresolved"
        },
        {
          code: "TRPR0004",
          status: "Unresolved"
        }
      ]
    ]

    cy.task("insertDummyCourtCasesWithTriggers", {
      caseTriggers,
      orgCode: "01",
      triggersLockedByUsername: "GeneralHandler"
    })

    cy.visit(caseURL)

    cy.get("#select-all-triggers button").click()
    cy.get("#mark-triggers-complete-button").click()

    cy.get("span.moj-badge--green")
      .should("have.length", caseTriggers[0].length)
      .each((el) => cy.wrap(el).should("have.text", "Complete"))

    clickTab("Notes")

    cy.get("td").contains(`GeneralHandler: Portal Action: Resolved Trigger. Code: PR01`)
    cy.get("td").contains(`GeneralHandler: Portal Action: Resolved Trigger. Code: PR02`)
    cy.get("td").contains(`GeneralHandler: Portal Action: Resolved Trigger. Code: PR03`)
    cy.get("td").contains(`GeneralHandler: Portal Action: Resolved Trigger. Code: PR04`)
  })
})
