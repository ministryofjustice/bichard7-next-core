import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { formatDate, subDays } from "date-fns"
import { TestTrigger } from "../../../test/utils/manageTriggers"
import { loginAndVisit } from "../../support/helpers"

describe("bails report page", () => {
  const insertSampleCases = () => {
    const bailTrigger: Partial<TestTrigger>[] = [
      {
        triggerCode: TriggerCode.TRPR0010,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]

    const domesticViolenceTrigger: Partial<TestTrigger>[] = [
      {
        triggerCode: TriggerCode.TRPR0023,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]

    const warrantsTrigger: Partial<TestTrigger>[] = [
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
        errorStatus: "Resolved",
        messageReceivedTimestamp: new Date(),
        ptiurn: "bail",
        defendantName: "Bail Name"
      },
      {
        orgForPoliceFilter: "01",
        messageReceivedTimestamp: new Date(),
        ptiurn: "domVi",
        defendantName: "DomesticViolence Name"
      },
      {
        orgForPoliceFilter: "01",
        messageReceivedTimestamp: new Date(),
        ptiurn: "warrants",
        defendantName: "Warrants Name"
      },
      {
        orgForPoliceFilter: "01",
        errorStatus: "Unresolved",
        triggerStatus: "Unresolved",
        errorReason: "",
        errorReport: ""
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: bailTrigger })
    cy.task("insertTriggers", { caseId: 1, triggers: domesticViolenceTrigger })
    cy.task("insertTriggers", { caseId: 2, triggers: warrantsTrigger })

    cy.task("insertException", {
      caseId: 3,
      exceptionCode: "HO100322",
      errorReport: "HO100322||ds:OrganisationUnitCode",
      errorStatus: "Resolved"
    })
  }

  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
    cy.task("clearCourtCases")
  })

  it("queries bails and successfully returns only bails", () => {
    insertSampleCases()

    cy.get("#report-select").select("Bail Conditions")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)

    cy.get(".results-area table th").contains("Bail Conditions Imposed")

    cy.get(".results-area table tbody tr td:nth(6)").should("have.text", "bail")
    cy.get(".results-area table tbody tr").contains("Bail Name")

    cy.get(".results-area table tbody tr").should("not.contain", "domVi")
    cy.get(".results-area table tbody tr").should("not.contain", "warrants")
    cy.get(".results-area table tbody tr").should("not.contain", "excepTrig")
  })

  it("queries domestic violence and successfully returns only domestic violence", () => {
    insertSampleCases()

    cy.get("#report-select").select("Domestic Violence & Vulnerable Victims")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 3)

    cy.get(".results-area table th").contains("Outcome")

    cy.get(".results-area table tbody tr td:nth(5)").should("have.text", "domVi")
    cy.get(".results-area table tbody tr").contains("DomesticViolence Name")

    cy.get(".results-area table tbody tr").should("not.contain", "bails")
    cy.get(".results-area table tbody tr").should("not.contain", "warrants")
    cy.get(".results-area table tbody tr").should("not.contain", "excepTrig")
  })

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

    cy.get(".results-area table tbody tr").should("not.contain", "bails")
    cy.get(".results-area table tbody tr").should("not.contain", "domVi")
    cy.get(".results-area table tbody tr").should("not.contain", "excepTrig")
  })

  it("queries exceptions/triggers and successfully returns only exceptions/triggers", () => {
    insertSampleCases()

    cy.get("#report-select").select("Resolved Exceptions/Triggers")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)

    cy.get(".results-area table tbody tr td:nth(2)").should("have.text", "Case00003")

    cy.get(".results-area table tbody tr").should("not.contain", "bails")
    cy.get(".results-area table tbody tr").should("not.contain", "domVi")
    cy.get(".results-area table tbody tr").should("not.contain", "excepTrig")
  })

  it("queries bails with a date window that should not return anything", () => {
    insertSampleCases()

    cy.get("#report-select").select("Bail Conditions")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })

  it("queries domestic violence with a date window that should not return anything", () => {
    insertSampleCases()

    cy.get("#report-select").select("Domestic Violence & Vulnerable Victims")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })

  it("queries warrants with a date window that should not return anything", () => {
    insertSampleCases()

    cy.get("#report-select").select("Warrants")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })

  it("queries exceptions/triggers with a date window that should not return anything", () => {
    insertSampleCases()

    cy.get("#report-select").select("Resolved Exceptions/Triggers")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })

  it("queries exceptions/triggers with triggers unchecked and successfully returns only exceptions", () => {
    insertSampleCases()

    cy.get("#report-select").select("Resolved Exceptions/Triggers")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))
    cy.get("#triggers").click()

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)

    cy.get(".results-area table tbody tr td:nth(2)").should("have.text", "Case00003")
  })

  it("queries exceptions/triggers with exceptions unchecked and successfully returns only triggers", () => {
    insertSampleCases()

    cy.get("#report-select").select("Resolved Exceptions/Triggers")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))
    cy.get("#exceptions").click()

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)

    cy.get(".results-area table tbody tr td:nth(2)").should("have.text", "Case00003")
  })
})
