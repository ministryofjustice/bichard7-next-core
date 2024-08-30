import nextHearingDateExceptions from "../../../../../test/test-data/NextHearingDateExceptions.json"
import dummyAho from "../../../../../test/test-data/error_list_aho.json"
import { clickTab, loginAndVisit, submitAndConfirmExceptions, verifyUpdatedMessage } from "../../../../support/helpers"

describe("NextHearingDate", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      }
    ])
  })

  it("Should not be able to edit next hearing date field there is no exception", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: dummyAho.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Burglary other than dwelling with intent to steal").click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "01/02/2008")
    cy.get(".hearing-result-1 #next-hearing-date").should("not.exist")
  })

  it("Should not be able to edit next hearing date field when the case isn't in 'unresolved' state", () => {
    const submittedCaseId = 0
    const resolvedCaseId = 1
    cy.task("insertCourtCasesWithFields", [
      {
        errorStatus: "Submitted",
        errorId: submittedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      },
      {
        errorStatus: "Resolved",
        errorId: resolvedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit(`/bichard/court-cases/${submittedCaseId}`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "false")
    cy.get(".hearing-result-1 #next-hearing-date").should("not.exist")

    cy.visit(`/bichard/court-cases/${resolvedCaseId}`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "false")
    cy.get(".hearing-result-1 #next-hearing-date").should("not.exist")
  })

  it("Shouldn't see editable next hearing date when it has no value", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with no exceptions").click()
    cy.contains("td", "Next hearing date").should("not.exist")
  })

  it("Should be able to edit field if HO100102 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "false")
    cy.get(".hearing-result-1 #next-hearing-date").type("2024-01-01")

    submitAndConfirmExceptions()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2024-01-01")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<ds:NextHearingDate>false</ds:NextHearingDate>"],
      updatedMessageHaveContent: ["<ds:NextHearingDate>2024-01-01</ds:NextHearingDate>"]
    })

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "false")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing date").siblings().should("include.text", "1/01/2024")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should be able to edit field if HO100323 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100323,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100323,
        errorCount: 1
      }
    ])
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "")
    cy.get(".hearing-result-1 #next-hearing-date").type("2023-12-24")
    submitAndConfirmExceptions()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2023-12-24")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<ds:NextHearingDate />"],
      updatedMessageHaveContent: ["<ds:NextHearingDate>2023-12-24</ds:NextHearingDate>"]
    })

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()

    cy.contains("td", "Next hearing date").siblings().should("include.text", "")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing date").siblings().should("include.text", "24/12/2023")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should be able to edit and submit multiple next hearing dates", () => {
    loginAndVisit("/bichard/court-cases/0")
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get(".hearing-result-1 #next-hearing-date").type("2024-01-01")
    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF01")
    cy.get(".hearing-result-1 #next-hearing-date").type("2023-12-24")
    submitAndConfirmExceptions()
    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2024-01-01")
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2023-12-24")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")
    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<ds:NextHearingDate>false</ds:NextHearingDate>", "<ds:NextHearingDate />"],
      updatedMessageHaveContent: [
        "<ds:NextHearingDate>2024-01-01</ds:NextHearingDate>",
        "<ds:NextHearingDate>2023-12-24</ds:NextHearingDate>"
      ]
    })
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "false")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing date").siblings().should("include.text", "1/01/2024")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Correction")
    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing date").siblings().should("include.text", "24/12/2023")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should be able to edit multiple hearing results with incorrect next hearing date", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get(".hearing-result-1").contains("td", "Next hearing date").siblings().should("include.text", "false")
    cy.get(".hearing-result-1 #next-hearing-date").type("2024-01-01")
    cy.get(".hearing-result-1 .next-hearing-date-row .success-message").contains("Input saved").should("exist")

    cy.get(".hearing-result-2").contains("td", "Next hearing date").siblings().should("include.text", "203-12-aa")
    cy.get(".hearing-result-2 #next-hearing-date").type("2025-12-12")
    cy.get(".hearing-result-2 .next-hearing-date-row .success-message").contains("Input saved").should("exist")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Unresolved" },
      updatedMessageNotHaveContent: [
        "<ds:NextHearingDate>false</ds:NextHearingDate>",
        "<ds:NextHearingDate>203-12-aa</ds:NextHearingDate>"
      ],
      updatedMessageHaveContent: [
        "<ds:NextHearingDate>2024-01-01</ds:NextHearingDate>",
        "<ds:NextHearingDate>2025-12-12</ds:NextHearingDate>"
      ]
    })

    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2024-01-01")
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2025-12-12")
  })

  it("Should display error message when auto-save fails", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    cy.intercept("PUT", "/bichard/api/court-cases/0/update", {
      statusCode: 500
    })

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "")
    cy.get(".hearing-result-1 .next-hearing-date-row #next-hearing-date").type("2023-12-24")
    cy.get(".hearing-result-1 .next-hearing-date-row .error-message")
      .contains("Autosave has failed, please refresh")
      .should("exist")
    cy.get(".hearing-result-1 .next-hearing-date-row .success-message").should("not.exist")
  })

  it("Should auto-save next hearing date", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100323,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100323,
        errorCount: 1
      }
    ])
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "")
    cy.get(".hearing-result-1 #next-hearing-date").type("2023-12-24")
    cy.get(".hearing-result-1 .next-hearing-date-row .success-message").contains("Input saved").should("exist")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Unresolved" },
      updatedMessageNotHaveContent: ["<ds:NextHearingDate />"],
      updatedMessageHaveContent: ["<ds:NextHearingDate>2023-12-24</ds:NextHearingDate>"]
    })
  })

  it("Should validate and auto-save the next hearing date correction and update notes", () => {
    const errorId = 0
    const newDate = "2023-12-24"

    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100323,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100323,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
    cy.intercept("PUT", `/bichard/api/court-cases/${errorId}/update`).as("save")

    loginAndVisit(`/bichard/court-cases/${errorId}`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "")
    cy.get("#next-hearing-date").type(newDate)

    cy.wait("@save")

    cy.get(".next-hearing-date-row .success-message").contains("Input saved").should("exist")

    cy.get("@save").its("response.body.courtCase.errorId").should("eq", errorId)
    cy.get("@save")
      .its(
        "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].NextHearingDate"
      )
      .should("include", newDate)

    clickTab("Notes")
    cy.get("td").contains(
      `GeneralHandler: Portal Action: Update Applied. Element: nextHearingDate. New Value: ${newDate}`
    )
  })

  it("Should not be able to edit next hearing date field when exception is not locked by current user", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "BichardForce02"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
  })

  it("Should not be able to edit next hearing date field when phase is not hearing outcome", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        phase: 2
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
  })

  it("Should not be able to edit next hearing date field when user is not exception-handler", () => {
    loginAndVisit("TriggerHandler", "/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
  })

  describe("when I submit resolved exceptions I should not the same value in the notes", () => {
    it("Should validate and auto-save the next hearing date correction and only update notes once", () => {
      const errorId = 0
      const newDate = "2023-12-24"

      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100323,
          updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100323,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])
      cy.intercept("PUT", `/bichard/api/court-cases/${errorId}/update`).as("save")

      loginAndVisit(`/bichard/court-cases/${errorId}`)

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link")
        .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
        .click()
      cy.contains("td", "Next hearing date").siblings().should("include.text", "")
      cy.get("#next-hearing-date").type(newDate)

      cy.wait("@save")

      cy.get(".next-hearing-date-row .success-message").contains("Input saved").should("exist")

      clickTab("Notes")
      cy.get(".notes-table")
        .find(
          `td:contains("GeneralHandler: Portal Action: Update Applied. Element: nextHearingDate. New Value: ${newDate}")`
        )
        .should("have.length", 1)

      submitAndConfirmExceptions()

      clickTab("Notes")
      cy.get(".notes-table")
        .find(
          `td:contains("GeneralHandler: Portal Action: Update Applied. Element: nextHearingDate. New Value: ${newDate}")`
        )
        .should("have.length", 1)
    })
  })
})
