import dummyMultipleHearingResultsAho from "../../../../test/test-data/multipleHearingResultsOnOffence.json"
import { clickTab, loginAndVisit } from "../../../support/helpers"

describe("Collapsable-sections", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: dummyMultipleHearingResultsAho.hearingOutcomeXml,
        errorCount: 1
      }
    ])
    loginAndVisit("/bichard/court-cases/0")
    clickTab("Offences")
  })

  describe("Offence", () => {
    it("shows offence details by default and collapses on title click", () => {
      cy.get("tbody tr:nth-child(1) td:nth-child(5) a").click()

      cy.contains("h2", "Offence 1 of 2")
      cy.contains("dt", "Offence code").should("exist")
      cy.contains("dt", "Offence title").should("exist")
      cy.contains("dt", "Offence start date").should("exist")
      cy.contains("dt", "Arrest date").should("exist")
      cy.contains("dt", "Charge date").should("exist")
      cy.contains("dt", "Conviction date").should("exist")
      cy.contains("dt", "Offence description").should("exist")
      cy.contains("dt", "Offence location").should("exist")
      cy.contains("dt", "PNC sequence number").should("exist")
      cy.contains("dt", "Court offence sequence number").should("exist")
      cy.contains("dt", "Plea").should("exist")
      cy.contains("dt", "Verdict").should("exist")
      cy.contains("dt", "Offence category").should("exist")
      cy.contains("dt", "Recordable on PNC").should("exist")
      cy.contains("dt", "Committed on bail").should("exist")
      cy.contains("dt", "Notifiable to Home Office").should("exist")
      cy.contains("dt", "Home Office classification").should("exist")

      // Collapse offence details
      cy.contains("h2", "Offence 1 of 2").click()

      cy.contains("dt", "Offence code").should("not.exist")
      cy.contains("dt", "Offence title").should("not.exist")
      cy.contains("dt", "Offence start date").should("not.exist")
      cy.contains("dt", "Arrest date").should("not.exist")
      cy.contains("dt", "Charge date").should("not.exist")
      cy.contains("dt", "Conviction date").should("not.exist")
      cy.contains("dt", "Offence description").should("not.exist")
      cy.contains("dt", "Offence location").should("not.exist")
      cy.contains("dt", "PNC sequence number").should("not.exist")
      cy.contains("dt", "Court offence sequence number").should("not.exist")
      cy.contains("dt", "Plea").should("not.exist")
      cy.contains("dt", "Verdict").should("not.exist")
      cy.contains("dt", "Offence category").should("not.exist")
      cy.contains("dt", "Recordable on PNC").should("not.exist")
      cy.contains("dt", "Committed on bail").should("not.exist")
      cy.contains("dt", "Notifiable to Home Office").should("not.exist")
      cy.contains("dt", "Home Office classification").should("not.exist")
    })

    it("maintains offence collapsed state when navigating between offences", () => {
      cy.get("tbody tr:nth-child(1) td:nth-child(5) a").click()

      // Collapse offence details
      cy.contains("h2", "Offence 1 of 2").click()

      cy.contains("dt", "Offence code").should("not.exist")
      cy.contains("dt", "Offence title").should("not.exist")
      cy.contains("dt", "Offence start date").should("not.exist")
      cy.contains("dt", "Arrest date").should("not.exist")
      cy.contains("dt", "Charge date").should("not.exist")
      cy.contains("dt", "Conviction date").should("not.exist")
      cy.contains("dt", "Offence description").should("not.exist")
      cy.contains("dt", "Offence location").should("not.exist")
      cy.contains("dt", "PNC sequence number").should("not.exist")
      cy.contains("dt", "Court offence sequence number").should("not.exist")
      cy.contains("dt", "Plea").should("not.exist")
      cy.contains("dt", "Verdict").should("not.exist")
      cy.contains("dt", "Offence category").should("not.exist")
      cy.contains("dt", "Recordable on PNC").should("not.exist")
      cy.contains("dt", "Committed on bail").should("not.exist")
      cy.contains("dt", "Notifiable to Home Office").should("not.exist")
      cy.contains("dt", "Home Office classification").should("not.exist")

      cy.get("button").contains("Next offence").click()
      cy.get("button").contains("Previous offence").click()

      cy.contains("dt", "Offence code").should("not.exist")
      cy.contains("dt", "Offence title").should("not.exist")
      cy.contains("dt", "Offence start date").should("not.exist")
      cy.contains("dt", "Arrest date").should("not.exist")
      cy.contains("dt", "Charge date").should("not.exist")
      cy.contains("dt", "Conviction date").should("not.exist")
      cy.contains("dt", "Offence description").should("not.exist")
      cy.contains("dt", "Offence location").should("not.exist")
      cy.contains("dt", "PNC sequence number").should("not.exist")
      cy.contains("dt", "Court offence sequence number").should("not.exist")
      cy.contains("dt", "Plea").should("not.exist")
      cy.contains("dt", "Verdict").should("not.exist")
      cy.contains("dt", "Offence category").should("not.exist")
      cy.contains("dt", "Recordable on PNC").should("not.exist")
      cy.contains("dt", "Committed on bail").should("not.exist")
      cy.contains("dt", "Notifiable to Home Office").should("not.exist")
      cy.contains("dt", "Home Office classification").should("not.exist")

      cy.get("button").contains("Next offence").click()
      cy.contains("dt", "Offence code").should("exist")
      cy.contains("dt", "Offence title").should("exist")
      cy.contains("dt", "Offence start date").should("exist")
      cy.contains("dt", "Arrest date").should("exist")
      cy.contains("dt", "Charge date").should("exist")
      cy.contains("dt", "Conviction date").should("exist")
      cy.contains("dt", "Offence description").should("exist")
      cy.contains("dt", "Offence location").should("exist")
      cy.contains("dt", "PNC sequence number").should("exist")
      cy.contains("dt", "Court offence sequence number").should("exist")
      cy.contains("dt", "Plea").should("exist")
      cy.contains("dt", "Verdict").should("exist")
      cy.contains("dt", "Offence category").should("exist")
      cy.contains("dt", "Recordable on PNC").should("exist")
      cy.contains("dt", "Committed on bail").should("exist")
      cy.contains("dt", "Notifiable to Home Office").should("exist")
      cy.contains("dt", "Home Office classification").should("exist")
    })
  })

  describe("Hearing-results", () => {
    it("shows hearing results by default and collapses on title click", () => {
      cy.get("tbody tr:nth-child(1) td:nth-child(5) a").click()

      cy.contains(".hearing-result-1 dt", "CJS Code").should("exist")
      cy.contains(".hearing-result-1 dt", "PNC disposal type").should("exist")
      cy.contains(".hearing-result-1 dt", "Result hearing type").should("exist")
      cy.contains(".hearing-result-1 dt", "Result hearing date").should("exist")
      cy.contains(".hearing-result-1 dt", "Hearing result description").should("exist")
      cy.contains(".hearing-result-1 dt", "Type of trial").should("exist")
      cy.contains(".hearing-result-1 dt", "Type of result").should("exist")
      cy.contains(".hearing-result-1 dt", "PNC adjudication exists").should("exist")

      cy.contains(".hearing-result-3 dt", "CJS Code").should("exist")
      cy.contains(".hearing-result-3 dt", "PNC disposal type").should("exist")
      cy.contains(".hearing-result-3 dt", "Result hearing type").should("exist")
      cy.contains(".hearing-result-3 dt", "Result hearing date").should("exist")
      cy.contains(".hearing-result-3 dt", "Hearing result description").should("exist")
      cy.contains(".hearing-result-3 dt", "Type of trial").should("exist")
      cy.contains(".hearing-result-3 dt", "Type of result").should("exist")
      cy.contains(".hearing-result-3 dt", "PNC adjudication exists").should("exist")

      // Collapse First Hearing-results details
      cy.get('[data-testid="hearing-result-1"]').click()

      cy.contains(".hearing-result-1 dt", "CJS Code").should("not.exist")
      cy.contains(".hearing-result-1 dt", "PNC disposal type").should("not.exist")
      cy.contains(".hearing-result-1 dt", "Result hearing type").should("not.exist")
      cy.contains(".hearing-result-1 dt", "Result hearing date").should("not.exist")
      cy.contains(".hearing-result-1 dt", "Hearing result description").should("not.exist")
      cy.contains(".hearing-result-1 dt", "Type of trial").should("not.exist")
      cy.contains(".hearing-result-1 dt", "Type of result").should("not.exist")
      cy.contains(".hearing-result-1 dt", "PNC adjudication exists").should("not.exist")

      // Collapse Third Hearing-results details
      cy.get('[data-testid="hearing-result-3"]').click()

      cy.contains(".hearing-result-3 dt", "CJS Code").should("not.exist")
      cy.contains(".hearing-result-3 dt", "PNC disposal type").should("not.exist")
      cy.contains(".hearing-result-3 dt", "Result hearing type").should("not.exist")
      cy.contains(".hearing-result-3 dt", "Result hearing date").should("not.exist")
      cy.contains(".hearing-result-3 dt", "Hearing result description").should("not.exist")
      cy.contains(".hearing-result-3 dt", "Type of trial").should("not.exist")
      cy.contains(".hearing-result-3 dt", "Type of result").should("not.exist")
      cy.contains(".hearing-result-3 dt", "PNC adjudication exists").should("not.exist")
    })

    it("maintains hearing-results collapsed state when navigating between offences", () => {
      cy.get("tbody tr:nth-child(1) td:nth-child(5) a").click()

      cy.contains(".hearing-result-1 dt", "CJS Code").should("exist")
      cy.contains(".hearing-result-1 dt", "PNC disposal type").should("exist")
      cy.contains(".hearing-result-1 dt", "Result hearing type").should("exist")
      cy.contains(".hearing-result-1 dt", "Result hearing date").should("exist")
      cy.contains(".hearing-result-1 dt", "Hearing result description").should("exist")
      cy.contains(".hearing-result-1 dt", "Type of trial").should("exist")
      cy.contains(".hearing-result-1 dt", "Type of result").should("exist")
      cy.contains(".hearing-result-1 dt", "PNC adjudication exists").should("exist")

      cy.contains(".hearing-result-3 dt", "CJS Code").should("exist")
      cy.contains(".hearing-result-3 dt", "PNC disposal type").should("exist")
      cy.contains(".hearing-result-3 dt", "Result hearing type").should("exist")
      cy.contains(".hearing-result-3 dt", "Result hearing date").should("exist")
      cy.contains(".hearing-result-3 dt", "Hearing result description").should("exist")
      cy.contains(".hearing-result-3 dt", "Type of trial").should("exist")
      cy.contains(".hearing-result-3 dt", "Type of result").should("exist")
      cy.contains(".hearing-result-3 dt", "PNC adjudication exists").should("exist")

      // Collapse first and third Hearing-results details
      cy.get('[data-testid="hearing-result-1"]').click()
      cy.get('[data-testid="hearing-result-3"]').click()

      cy.get("button").contains("Next offence").click()
      cy.get("button").contains("Previous offence").click()

      cy.contains(".hearing-result-1 dt", "CJS Code").should("not.exist")
      cy.contains(".hearing-result-1 dt", "PNC disposal type").should("not.exist")
      cy.contains(".hearing-result-1 dt", "Result hearing type").should("not.exist")
      cy.contains(".hearing-result-1 dt", "Result hearing date").should("not.exist")
      cy.contains(".hearing-result-1 dt", "Hearing result description").should("not.exist")
      cy.contains(".hearing-result-1 dt", "Type of trial").should("not.exist")
      cy.contains(".hearing-result-1 dt", "Type of result").should("not.exist")
      cy.contains(".hearing-result-1 dt", "PNC adjudication exists").should("not.exist")

      cy.contains(".hearing-result-3 dt", "CJS Code").should("not.exist")
      cy.contains(".hearing-result-3 dt", "PNC disposal type").should("not.exist")
      cy.contains(".hearing-result-3 dt", "Result hearing type").should("not.exist")
      cy.contains(".hearing-result-3 dt", "Result hearing date").should("not.exist")
      cy.contains(".hearing-result-3 dt", "Hearing result description").should("not.exist")
      cy.contains(".hearing-result-3 dt", "Type of trial").should("not.exist")
      cy.contains(".hearing-result-3 dt", "Type of result").should("not.exist")
      cy.contains(".hearing-result-3 dt", "PNC adjudication exists").should("not.exist")
    })
  })
})
