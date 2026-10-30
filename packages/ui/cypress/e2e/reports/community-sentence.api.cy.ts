import { formatDate, subDays } from "date-fns"
import { loginAndVisit } from "../../support/helpers"
import { insertSampleCases } from "./utils"

describe("community sentence report type filter", () => {
  beforeEach(() => {
    loginAndVisit("CommunitySentenceReportUser", "/bichard/report-selection")
    cy.task("clearCourtCases")
  })

  it("queries warrants and successfully displays only warrants", () => {
    insertSampleCases()
    cy.get("#report-select").select("Community sentence")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)

    const headers = [
      "Date received",
      "Name",
      "Date of birth",
      "PNCID",
      "Offence",
      "Domestic violence case",
      "Suspended Sentence Order duration (months)",
      "Custodial Sentence Order duration (months)",
      "Date of sentence",
      "Expiry",
      "Home address",
      "Offence address",
      "Offence start date",
      "Arrest date",
      "Charge date",
      "Plea",
      "Result code"
    ]

    headers.forEach((text, index) => {
      cy.get(".results-area table th").eq(index).should("have.text", text)
    })
  })
})
