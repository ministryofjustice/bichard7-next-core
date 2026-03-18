import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { formatDate, subDays } from "date-fns"
import { TestTrigger } from "../../../test/utils/manageTriggers"
import { loginAndVisit } from "../../support/helpers"
import { insertSampleCases } from "./utils"

describe("domestic violence report type filter", () => {
  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
    cy.task("clearCourtCases")
  })

  const insertCaseWithVulnerableVictimTrigger = () => {
    const vulnerableVictimTrigger: Partial<TestTrigger>[] = [
      {
        triggerCode: TriggerCode.TRPR0024,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]

    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        messageReceivedTimestamp: new Date(),
        ptiurn: "domVi",
        defendantName: "VulnerableVictim Name"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: vulnerableVictimTrigger })
  }

  const insertCaseWithVulnerableVictimAndDomViTrigger = () => {
    const vulnerableVictimAndDomViTrigger: Partial<TestTrigger>[] = [
      {
        triggerCode: TriggerCode.TRPR0024,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      },
      {
        triggerCode: TriggerCode.TRPR0023,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]

    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        messageReceivedTimestamp: new Date(),
        ptiurn: "domVi",
        defendantName: "DomesticViolence Name"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: vulnerableVictimAndDomViTrigger })
  }

  it("queries domestic violence and successfully displays only domestic violence", () => {
    insertSampleCases()
    cy.get("#report-select").select("Domestic Violence & Vulnerable Victims")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 3)

    const expectedHeaders = [
      "Type",
      "Hearing Date",
      "Court Name",
      "Defendant Name",
      "Date of Birth",
      "PTIURN",
      "ASN",
      "Offence Title",
      "Outcome"
    ]

    expectedHeaders.forEach((headerText, index) => {
      cy.get(".results-area table th").eq(index).should("have.text", headerText)
    })

    cy.get(".results-area table tbody tr td:nth(5)").should("have.text", "domVi")
    cy.get(".results-area table tbody tr td:nth(3)").contains("DomesticViolence Name")

    cy.get(".results-area table tbody tr").should("not.contain", "Bails Name")
    cy.get(".results-area table tbody tr").should("not.contain", "Warrants Name")
  })

  it("queries domestic violence with a date window that should not return anything", () => {
    insertSampleCases()
    cy.get("#report-select").select("Domestic Violence & Vulnerable Victims")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })

  it("queries a case with a vulnerable victim trigger only", () => {
    insertCaseWithVulnerableVictimTrigger()
    cy.get("#report-select").select("Domestic Violence & Vulnerable Victims")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr td:nth(0)").should("have.text", "Vulnerable Victim")
  })

  it("queries a case with both a vulnerable victim trigger and a domestic violence trigger", () => {
    insertCaseWithVulnerableVictimAndDomViTrigger()
    cy.get("#report-select").select("Domestic Violence & Vulnerable Victims")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr td:nth(0)").should("have.text", "Domestic Violence")
  })
})
