import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import CourtCase from "services/entities/CourtCase"
import dummyAho from "../../../../test/test-data/error_list_aho.json"
import { TestTrigger } from "../../../../test/utils/manageTriggers"
import { loginAndVisit } from "../../../support/helpers"

describe("View Court Case Details Summary Box", () => {
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
        ptiurn: "ptirn-value",
        asn: "asn-value",
        courtName: "cName-value",
        orgForPoliceFilter: "01",
        hearingOutcome: dummyAho.hearingOutcomeXml.replace("9625UC0000000118191Z", "asn-value")
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: [trigger] })
    cy.task("insertException", exception)
  }

  before(() => {
    cy.task("clearCourtCases")
    cy.clearCookies()
  })

  after(() => {
    cy.resetDeviceMetrics()
  })

  it("displays the required fields", () => {
    insertCaseWithTriggerAndException()
    loginAndVisit("/bichard/court-cases/0")

    cy.contains("ASN")
    cy.contains("as/n-va/lu/e")

    cy.contains("Court code (LJA)")
    cy.contains("1892")

    cy.contains("Court name")
    cy.contains("cName-value")

    cy.contains("Court name")
    cy.contains("cName-value")

    cy.contains("PNCID")
    cy.contains("2706/1234567P")

    cy.contains("PTIURN")
    cy.contains("ptirn-value")

    cy.contains("DOB")
    cy.contains("29/10/1949")

    cy.contains("Hearing date")
    cy.contains("11/01/2008")
  })

  it("doesn't show the hide/show element when not zoomed in and 1280px", () => {
    insertCaseWithTriggerAndException()
    loginAndVisit("/bichard/court-cases/0")

    cy.get(".govuk-accordion__summary-box").should("not.be.visible")
  })

  it("doesn't show the hide/show element when not zoomed in and 786px", () => {
    insertCaseWithTriggerAndException()
    loginAndVisit("/bichard/court-cases/0")

    cy.viewport(768, 1024)

    cy.get(".govuk-accordion__summary-box").should("not.be.visible")
  })

  it("does show the hide/show element when zoomed in and viewed at 768px", () => {
    insertCaseWithTriggerAndException()
    loginAndVisit("/bichard/court-cases/0")

    cy.viewport(768, 1024)
    cy.setDevicePixelRatio(2)

    cy.get(".govuk-accordion__summary-box").should("be.visible")
    cy.get("aside").should("have.length", 1)
    cy.get(".govuk-accordion__summary-box").click()

    cy.get("aside").should("have.length", 0)
  })
})
