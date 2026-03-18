import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { formatDate, subDays } from "date-fns"
import { TestTrigger } from "../../../test/utils/manageTriggers"
import { loginAndVisit } from "../../support/helpers"
import { insertSampleCases } from "./utils"

describe("warrants report type filter", () => {
  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
    cy.task("clearCourtCases")
  })

  const insertCaseWithWithdrawnTrigger = () => {
    const withdrawnTrigger: Partial<TestTrigger>[] = [
      {
        triggerCode: TriggerCode.TRPR0012,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]

    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        messageReceivedTimestamp: new Date(),
        ptiurn: "domVi",
        defendantName: "Withdrawn Name"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: withdrawnTrigger })
  }

  const insertCaseWithFTATrigger = () => {
    const ftaTrigger: Partial<TestTrigger>[] = [
      {
        triggerCode: TriggerCode.TRPR0002,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]

    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        messageReceivedTimestamp: new Date(),
        ptiurn: "domVi",
        defendantName: "FTA Name"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: ftaTrigger })
  }

  const insertCaseWithFTAAndWithdrawnTrigger = () => {
    const bothTriggers: Partial<TestTrigger>[] = [
      {
        triggerCode: TriggerCode.TRPR0012,
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
        orgForPoliceFilter: "01",
        messageReceivedTimestamp: new Date(),
        ptiurn: "domVi",
        defendantName: "FTA Name"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: bothTriggers })
  }

  it("queries warrants and successfully returns only warrants", () => {
    insertSampleCases()
    cy.get("#report-select").select("Warrants")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)

    cy.get(".results-area table th").contains("Warrant Type")

    cy.get(".results-area table tbody tr td:nth(8)").should("have.text", "warrants")
    cy.get(".results-area table tbody tr").contains("Warrants Name")

    cy.get(".results-area table tbody tr").should("not.contain", "Bails Name")
    cy.get(".results-area table tbody tr").should("not.contain", "DomesticViolence Name")
  })

  it("queries warrants with a date window that should not return anything", () => {
    insertSampleCases()
    cy.get("#report-select").select("Warrants")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })

  it("valid warrants query, the only case available will have a single 'Withdrawn' trigger", () => {
    insertCaseWithWithdrawnTrigger()
    cy.get("#report-select").select("Warrants")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 0), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr td:nth(15)").should("have.text", "Withdrawn")
  })

  it("valid warrants query, the only case available will have a single 'FTA' trigger", () => {
    insertCaseWithFTATrigger()
    cy.get("#report-select").select("Warrants")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 0), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr td:nth(15)").should("have.text", "FTA")
  })

  it("valid warrants query, the only case available will have both an 'FTA' and a 'Withdrawn' trigger", () => {
    insertCaseWithFTAAndWithdrawnTrigger()
    cy.get("#report-select").select("Warrants")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 0), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr td:nth(15)").should("contain", "FTA")
    cy.get(".results-area table tbody tr td:nth(15)").should("contain", "Withdrawn")
  })
})
