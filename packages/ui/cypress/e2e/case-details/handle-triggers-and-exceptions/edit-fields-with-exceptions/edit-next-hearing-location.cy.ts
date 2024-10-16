import dummyAho from "../../../../../test/test-data/HO100102_1.json"
import multipleExceptions from "../../../../../test/test-data/NextHearingDateExceptions.json"
import nextHearingLocationExceptions from "../../../../../test/test-data/NextHearingLocationExceptions.json"
import { clickTab, loginAndVisit, submitAndConfirmExceptions, verifyUpdatedMessage } from "../../../../support/helpers"

describe("NextHearingLocation", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
  })

  it("Should not be able to edit next hearing location field if there is no exception", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with no exception").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46AM03")
  })

  it("Shouldn't see next hearing location field when it has no value", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: dummyAho.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Use a motor vehicle on a road / public place without third party insurance").click()
    cy.contains("td", "Next hearing location").should("not.exist")
  })

  it("Should be able to edit field if HO100200 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.get("#next-hearing-location").should("not.have.value", "B@1EF$1")
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF01")

    submitAndConfirmExceptions()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B01EF01")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ['<ds:OrganisationUnitCode Error="HO100200">B@1EF$1</ds:OrganisationUnitCode>'],
      updatedMessageHaveContent: ["<ds:OrganisationUnitCode>B01EF01</ds:OrganisationUnitCode>"]
    })

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B01EF01")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should be able to edit field if HO100300 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100300,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100300,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46AM03")
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B46DB00")

    submitAndConfirmExceptions()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B46DB00")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ['<ds:OrganisationUnitCode Error="HO100300">B46AM03</ds:OrganisationUnitCode>'],
      updatedMessageHaveContent: ["<ds:OrganisationUnitCode>B46DB00</ds:OrganisationUnitCode>"]
    })

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46AM03")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46DB00")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should be able to edit field if HO100322 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100322,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100322,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF00")

    submitAndConfirmExceptions()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B01EF00")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ['<ds:OrganisationUnitCode Error="HO100322" />'],
      updatedMessageHaveContent: ["<ds:OrganisationUnitCode>B01EF00</ds:OrganisationUnitCode>"]
    })

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B01EF00")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should fetch organisation units once the user has finished typing", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100322,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100322,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.intercept(
      `${Cypress.config("baseUrl")}/bichard/api/organisation-units?search=*`,
      cy.spy().as("fetchOrganisation")
    )

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B")
    cy.get("#next-hearing-location").type("0")
    cy.get("#next-hearing-location").type("1")
    cy.get("@fetchOrganisation").should("have.been.calledOnce")
  })

  it("Should be able to edit multiple next hearing locations", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF00")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()

    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B21XA00")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()

    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B46DB00")

    submitAndConfirmExceptions()

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B01EF00")
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B46DB00")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: [
        '<ds:OrganisationUnitCode Error="HO100300">B46AM03</ds:OrganisationUnitCode>',
        '<ds:OrganisationUnitCode Error="HO100322" />',
        '<ds:OrganisationUnitCode Error="HO100200">B@1EF$1</ds:OrganisationUnitCode>'
      ],
      updatedMessageHaveContent: [
        "<ds:OrganisationUnitCode>B01EF00</ds:OrganisationUnitCode>",
        "<ds:OrganisationUnitCode>B46DB00</ds:OrganisationUnitCode>",
        "<ds:OrganisationUnitCode>B21XA00</ds:OrganisationUnitCode>"
      ]
    })

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46AM03")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B01EF00")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46DB00")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B21XA00")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should be able to edit multiple hearing results with incorrect next hearing location exceptions", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.nextHearingLocationExceptionOnMultipleResults,
        updatedHearingOutcome: nextHearingLocationExceptions.nextHearingLocationExceptionOnMultipleResults,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get(".hearing-result-1").contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")

    cy.get(".hearing-result-1 #next-hearing-location").clear()
    cy.get(".hearing-result-1 #next-hearing-location").type("B01EF00")
    cy.get(".hearing-result-1 .next-hearing-location-row .success-message").contains("Input saved").should("exist")

    cy.get(".hearing-result-2")
      .contains("td", "Next hearing location")
      .siblings()
      .should("include.text", "NOTANEXTHEARINGLOCATION")
    cy.get(".hearing-result-2 #next-hearing-location").clear()
    cy.get(".hearing-result-2 #next-hearing-location").type("C04BF00")
    cy.get(".hearing-result-2 .next-hearing-location-row .success-message").contains("Input saved").should("exist")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Unresolved" },
      updatedMessageNotHaveContent: [
        '<ds:OrganisationUnitCode Error="HO100200">B@1EF$1</ds:OrganisationUnitCode>',
        '<ds:OrganisationUnitCode Error="HO100200">NOTANEXTHEARINGLOCATION</ds:OrganisationUnitCode>'
      ],
      updatedMessageHaveContent: [
        "<ds:OrganisationUnitCode>B01EF00</ds:OrganisationUnitCode>",
        "<ds:OrganisationUnitCode>C04BF00</ds:OrganisationUnitCode>"
      ]
    })

    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B01EF00")
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: C04BF00")
  })

  it("Should not be able to edit next hearing location field when the case isn't in 'unresolved' state", () => {
    const submittedCaseId = 0
    const resolvedCaseId = 1
    cy.task("insertCourtCasesWithFields", [
      {
        errorStatus: "Submitted",
        errorId: submittedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      },
      {
        errorStatus: "Resolved",
        errorId: resolvedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit(`/bichard/court-cases/${submittedCaseId}`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()

    cy.visit(`/bichard/court-cases/${resolvedCaseId}`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
  })

  it("Should not be able to edit next hearing location field when exception is not locked by current user", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "BichardForce02"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
  })

  it("Should not be able to edit next hearing location field when phase is not hearing outcome", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        phase: 2
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
  })

  it("Should not be able to edit next hearing location field when user is not exception-handler", () => {
    loginAndVisit("TriggerHandler", "/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
  })

  it("Should display error message when Next Hearing Location is failed to auto-save", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: multipleExceptions.hearingOutcomeXml,
        updatedHearingOutcome: multipleExceptions.updatedHearingOutcomeXml,
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
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF00")

    cy.get(".next-hearing-location-row .success-message").should("not.exist")
    cy.get(".next-hearing-location-row .warning-icon").should("exist")
    cy.get(".next-hearing-location-row .error-message").contains("Autosave has failed, please refresh").should("exist")
  })

  it("Should validate Next Hearing Location and auto-save", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
    cy.intercept("PUT", "/bichard/api/court-cases/0/update").as("save")
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B43UY00")
    cy.get(".next-hearing-location-row .success-message").contains("Input saved").should("exist")

    cy.wait("@save")
    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Unresolved" },
      updatedMessageNotHaveContent: ['<ds:OrganisationUnitCode Error="HO100200">B@1EF$1</ds:OrganisationUnitCode>'],
      updatedMessageHaveContent: ["<ds:OrganisationUnitCode>B43UY00</ds:OrganisationUnitCode>"]
    })
  })

  it("Should validate and auto-save the next hearing location correction and update notes", () => {
    const errorId = 0
    const nextHearingLocation = "B43UY00"

    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
    cy.intercept("PUT", `/bichard/api/court-cases/${errorId}/update`).as("save")

    loginAndVisit(`/bichard/court-cases/${errorId}`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type(nextHearingLocation)

    cy.wait("@save")

    cy.get(".next-hearing-location-row .success-message").contains("Input saved").should("exist")

    cy.get("@save").its("response.body.courtCase.errorId").should("eq", errorId)
    cy.get("@save")
      .its(
        "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].NextResultSourceOrganisation.OrganisationUnitCode"
      )
      .should("eq", nextHearingLocation)

    clickTab("Notes")
    cy.get("td").contains(
      `GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: ${nextHearingLocation}`
    )
  })

  it("should display error when invalid Next Hearing Location is entered", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B43UYXX")

    cy.get(".next-hearing-location-row .success-message").should("not.exist")
    cy.get(".next-hearing-location-row .warning-icon").should("exist")
    cy.contains("Select valid Next hearing location").should("exist")
  })

  describe("when I submit resolved exceptions I should not see the same value in the notes", () => {
    it("Should validate and auto-save the next hearing location correction and only update notes once", () => {
      const errorId = 0
      const nextHearingLocation = "B43UY00"

      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
          updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])
      cy.intercept("PUT", `/bichard/api/court-cases/${errorId}/update`).as("save")

      loginAndVisit(`/bichard/court-cases/${errorId}`)

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type(nextHearingLocation)

      cy.wait("@save")

      cy.get(".next-hearing-location-row .success-message").contains("Input saved").should("exist")

      clickTab("Notes")
      cy.get(".notes-table")
        .find(
          `td:contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: ${nextHearingLocation}")`
        )
        .should("have.length", 1)

      submitAndConfirmExceptions()

      clickTab("Notes")
      cy.get(".notes-table")
        .find(
          `td:contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: ${nextHearingLocation}")`
        )
        .should("have.length", 1)
    })
  })
})
