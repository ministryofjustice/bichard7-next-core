import { clickTab, loginAndVisit } from "../../../support/helpers"
import HO100310 from "./fixtures/HO100310.json"

describe("Offence matching HO100310", () => {
  const fields = {
    defendantName: "Offence Matching HO100310",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100310,
    errorCount: 2,
    errorReason: "HO100310",
    errorReport: "HO100310||ds:OffenceReasonSequence, HO100310||ds:OffenceReasonSequence"
  }

  before(() => {
    cy.loginAs("GeneralHandler")
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [fields])

    loginAndVisit()
    cy.get("a[class*='Link']").contains(fields.defendantName).click()
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

    cy.get("#offences").contains("Theft of pedal cycle").click()
  })

  it("displays the offence matcher for offences with a HO100310 exception", () => {
    cy.get("select.offence-matcher").should("exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 2 of 5")
    cy.get("select.offence-matcher").should("not.exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 3 of 5")
    cy.get("select.offence-matcher").should("not.exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 4 of 5")
    cy.get("select.offence-matcher").should("exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 5 of 5")
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("loads offence matching information from the AHO PNC query", () => {
    cy.get("select.offence-matcher").children("optgroup").eq(0).should("have.attr", "label", "97/1626/008395Q")
    cy.get("select.offence-matcher").children("optgroup").eq(0).contains("option", "TH68006")
  })

  it("disables options that have already been selected", () => {
    cy.get("select.offence-matcher").select("001 - TH68006")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select").contains("option", "TH68006").should("be.disabled").and("not.be.selected")
  })

  it("loads options that were previously selected", () => {
    cy.get("select.offence-matcher").select("001 - TH68006")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select.offence-matcher").select("Added in court")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(0).click()
    cy.get("select").contains("option", "TH68006").should("be.selected")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select").contains("option", "Added in court").should("be.selected")
  })

  it("allows submission if any offences are unmatched", () => {
    cy.get("button#submit").should("be.enabled")

    cy.get("select.offence-matcher").select("001 - TH68006")
    cy.get("button#submit").should("be.enabled")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select.offence-matcher").select("Added in court")
    cy.get("button#submit").should("be.enabled")
  })

  it("sends correct offence matching amendments on submission", () => {
    cy.get("select.offence-matcher").select("001 - TH68006")
    cy.get(".offence-matcher + .success-message").contains("Input saved").should("exist")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select.offence-matcher").select("Added in court")
    cy.get(".offence-matcher + .success-message").contains("Input saved").should("exist")

    cy.intercept("POST", "/bichard/court-cases/0/submit").as("submit")
    cy.get("button#submit").click()
    cy.wait("@submit")

    // AutoSave will save amendments before this step, hence why there's no amendments
    cy.get("@submit")
      .its("request.body")
      .then((body) => {
        const json = Object.fromEntries(new URLSearchParams(body))
        const amendments = JSON.parse(json.amendments)
        return amendments
      })
      .should("deep.equal", {})
  })

  describe("when using the exception panel to navigate between exceptions", () => {
    it("has the correct values for the select dropdowns", () => {
      cy.get("select.offence-matcher").should("have.value", null)
      cy.get("select.offence-matcher").select("001 - TH68006")
      cy.get("select.offence-matcher").should("have.value", "1-97/1626/008395Q")
      cy.get("select.offence-matcher").find(":selected").contains("001 - TH68006")

      cy.get(".exception-location").contains("Offence 4").click()

      cy.get("select.offence-matcher").should("have.value", null)
      cy.get("select.offence-matcher").find(":selected").should("not.have.text", "001 - TH68006")
      cy.get("select.offence-matcher").find(":selected").should("have.text", "Select an offence")

      cy.get(".exception-location").contains("Offence 1").click()

      cy.get("select.offence-matcher").should("have.value", "1-97/1626/008395Q")

      cy.get(".exception-location").contains("Offence 4").click()

      cy.get("select.offence-matcher").select("Added in court")
      cy.get("select.offence-matcher").should("have.value", "0")

      cy.get(".exception-location").contains("Offence 1").click()

      cy.get("select.offence-matcher").should("have.value", "1-97/1626/008395Q")

      cy.get(".exception-location").contains("Offence 4").click()

      cy.get("select.offence-matcher").should("have.value", "0")
    })
  })

  describe("displays correct badges for offences", () => {
    it("on submitted cases", () => {
      cy.get("select.offence-matcher").select("001 - TH68006")

      cy.get("a").contains("Back to all offences").click()
      cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
      cy.get("select.offence-matcher").select("Added in court")

      cy.get("button#submit").click()
      cy.get("button#confirm-submit").click()

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get("#offences").contains("Theft of pedal cycle").click()
      cy.contains("Matched PNC offence")
      cy.get("span.moj-badge").contains("MATCHED")

      cy.get("a").contains("Back to all offences").click()
      cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
      cy.contains("Matched PNC offence")
      cy.get("span.moj-badge").contains("ADDED IN COURT")
    })

    it("on cases locked to someone else", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          ...fields,
          errorLockedByUsername: "ExceptionHandler"
        }
      ])

      cy.visit("/bichard/court-cases/0")
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

      cy.get("a:contains('Theft of pedal cycle')").eq(0).click()
      cy.get("span.moj-badge").contains("UNMATCHED")

      cy.get("a").contains("Back to all offences").click()
      cy.get("a:contains('Theft of pedal cycle')").eq(1).click()

      cy.get("span.moj-badge").contains("UNMATCHED")
    })
  })

  describe("with Autosave component", () => {
    const errorId = 0

    it("shows the saved message", () => {
      cy.intercept("PUT", `/bichard/api/court-cases/${errorId}/update`).as("save")

      cy.get("select.offence-matcher").select("001 - TH68006")

      cy.wait("@save")

      cy.get(".offence-matcher + .success-message").contains("Input saved").should("exist")
    })

    it("saves the first offence to a CCR", () => {
      cy.intercept("PUT", `/bichard/api/court-cases/${errorId}/update`).as("save")

      cy.get("select.offence-matcher").select("001 - TH68006")

      cy.wait("@save")
      cy.get("@save")
        .its("request.body")
        .then((body) => {
          const { offenceReasonSequence, offenceCourtCaseReferenceNumber } = body
          return { offenceReasonSequence, offenceCourtCaseReferenceNumber }
        })
        .should("deep.equal", {
          offenceReasonSequence: [{ offenceIndex: 0, value: 1 }],
          offenceCourtCaseReferenceNumber: [{ offenceIndex: 0, value: "97/1626/008395Q" }]
        })
    })

    it("saves the correct first offence to a CCR and the fourth offence 'Added in court'", () => {
      cy.intercept("PUT", `/bichard/api/court-cases/${errorId}/update`).as("save")

      cy.get("select.offence-matcher").select("001 - TH68006")
      cy.wait("@save")
      cy.get(".offence-matcher + .success-message").contains("Input saved").should("exist")
      cy.get("@save").its("response.body.courtCase.errorId").should("eq", errorId)
      cy.get("@save")
        .its(
          "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.0.ManualCourtCaseReference"
        )
        .should("be.true")
      cy.get("@save")
        .its(
          "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.0.ManualSequenceNumber"
        )
        .should("be.true")
      cy.get("@save")
        .its(
          "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.0.CourtOffenceSequenceNumber"
        )
        .should("eq", 1)
      cy.get("@save")
        .its(
          "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.0.CourtCaseReferenceNumber"
        )
        .should("eq", "97/1626/008395Q")

      cy.get(".exception-location").contains("Offence 4").click()

      cy.get("select.offence-matcher").select("Added in court")
      cy.wait("@save")
      cy.get(".offence-matcher + .success-message").contains("Input saved").should("exist")
      cy.get("@save")
        .its(
          "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.3.ManualCourtCaseReference"
        )
        .should("be.true")
      cy.get("@save")
        .its(
          "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.3.AddedByTheCourt"
        )
        .should("be.true")
      cy.get("@save")
        .its(
          "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.3.CourtOffenceSequenceNumber"
        )
        .should("eq", 4)
      cy.get("@save")
        .its(
          "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.3.CourtCaseReferenceNumber"
        )
        .should("be.null")

      clickTab("Notes")

      cy.get("td").contains(
        "GeneralHandler: Portal Action: Update Applied. Element: offenceReasonSequence. New Value: Added in court"
      )
      cy.get("td").contains(
        "GeneralHandler: Portal Action: Update Applied. Element: offenceReasonSequence. New Value: 1"
      )
      cy.get("td").contains(
        "GeneralHandler: Portal Action: Update Applied. Element: offenceCourtCaseReferenceNumber. New Value: 97/1626/008395Q"
      )
    })
  })
})
