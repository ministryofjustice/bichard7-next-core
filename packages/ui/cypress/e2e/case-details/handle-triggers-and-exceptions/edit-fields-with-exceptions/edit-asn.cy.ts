import AnnotatedHO from "../../../../../test/test-data/AnnotatedHO1.json"
import AsnExceptionHO100206 from "../../../../../test/test-data/AsnExceptionHo100206.json"
import AsnExceptionHO100321 from "../../../../../test/test-data/AsnExceptionHo100321.json"
import ExceptionHO100239 from "../../../../../test/test-data/HO100239_1.json"
import { clickTab, loginAndVisit, submitAndConfirmExceptions, verifyUpdatedMessage } from "../../../../support/helpers"

describe("ASN", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
  })

  it("Should not be able to edit ASN field when there is no exception", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AnnotatedHO.hearingOutcomeXml,
        errorCount: 0,
        errorStatus: null
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
  })

  it("Should not be able to edit ASN field when the case isn't in 'unresolved' state", () => {
    const submittedCaseId = 1
    const resolvedCaseId = 2
    cy.task("insertCourtCasesWithFields", [
      {
        errorStatus: "Submitted",
        errorId: submittedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1
      },
      {
        errorStatus: "Resolved",
        errorId: resolvedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit(`/bichard/court-cases/${submittedCaseId}`)

    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
    cy.get("#asn").should("not.exist")

    cy.visit(`/bichard/court-cases/${resolvedCaseId}`)

    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
    cy.get("#asn").should("not.exist")
  })

  it("Should not be able to edit ASN field if ASN exception is not raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: ExceptionHO100239.hearingOutcomeXml,
        updatedHearingOutcome: ExceptionHO100239.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get(".moj-badge").should("not.exist")
  })

  it("Should display an error message when auto-save fails", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    cy.intercept("PUT", "/bichard/api/court-cases/0/update", {
      statusCode: 500
    })

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000410836V")
    cy.get(".asn-row .error-message").contains("Autosave has failed, please refresh").should("exist")
    cy.get(".asn-row .success-message").should("not.exist")
  })

  it("Should validate and auto-save the ASN correction", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
    cy.intercept("PUT", "/bichard/api/court-cases/0/update").as("save")

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").type("AAAAAAAAAAAAAAAAAAAA")
    cy.get(".asn-row .error-message").should("exist")

    cy.get("button").contains("Submit exception(s)").should("be.enabled")
    cy.get("#asn").clear()

    cy.get("#asn").type("1101ZD0100000410836V")
    cy.get(".asn-row .success-message").contains("Input saved").should("exist")
    cy.get("button").contains("Submit exception(s)").should("be.enabled")

    cy.wait("@save")
    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Unresolved" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000410836V</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should validate and auto-save the ASN correction and update notes", () => {
    const errorId = 0
    const updatedAsn = "1101ZD0100000410836V"

    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
    cy.intercept("PUT", `/bichard/api/court-cases/${errorId}/update`).as("save")

    loginAndVisit(`/bichard/court-cases/${errorId}`)

    cy.get("#asn").type("AAAAAAAAAAAAAAAAAAAA")
    cy.get(".asn-row .error-message").should("exist")
    cy.get(".asn-row .error-message").contains("Enter ASN in the correct format")

    cy.get("button").contains("Submit exception(s)").should("be.enabled")
    cy.get("#asn").clear()

    cy.get("#asn").type(updatedAsn)

    cy.wait("@save")

    cy.get(".asn-row .success-message").contains("Input saved").should("exist")
    cy.get("button").contains("Submit exception(s)").should("be.enabled")

    cy.get("@save").its("response.body.courtCase.errorId").should("eq", errorId)
    cy.get("@save")
      .its(
        "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber"
      )
      .should("eq", updatedAsn)

    clickTab("Notes")
    cy.get("td").contains(`GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: ${updatedAsn}`)
  })

  it("Should be able to edit ASN field if HO100206 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("button").contains("Submit exception(s)").click()

    cy.contains(
      "Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"
    ).should("exist")
    cy.get("button").contains("Submit exception(s)").click()

    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: 1101ZD0100000448754K")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>AAAAAAAAAAAAAAAAAAAA</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should be able to edit ASN field if HO100321 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("button").contains("Submit exception(s)").click()

    cy.contains(
      "Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"
    ).should("exist")
    cy.get("button").contains("Submit exception(s)").click()

    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: 1101ZD0100000448754K")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>AAAAAAAAAAAAAAAAAAAA</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should keep the cursor in right place in the input field when the character from the middle is deleted", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("input#asn").clear()
    cy.get("input#asn").type("1101ZD01448754K")
    cy.get("input#asn").should("have.value", "11/01ZD/01/448754K")
    cy.get("input#asn").then(($el) => ($el[0] as unknown as HTMLInputElement).setSelectionRange(5, 5))
    cy.get("input#asn").type("{backspace}")
    cy.get("input#asn").should("have.prop", "selectionStart", 4)
  })

  it("Should keep the cursor in right place in the input field when the character is added in the middle", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("input#asn").clear()
    cy.get("input#asn").type("1101Z01448754K")
    cy.get("input#asn").should("have.value", "11/01Z0/14/48754K")
    cy.get("input#asn").then(($el) => ($el[0] as unknown as HTMLInputElement).setSelectionRange(5, 5))
    cy.get("input#asn").type("D")
    cy.get("input#asn").should("have.prop", "selectionStart", 6)
  })

  it("Should divide ASN into sections when user types or pastes asn into the input field ", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("#asn").should("have.value", "11/01ZD/01/00000448754K")
  })

  it("Should divide ASN into sections when user types or pastes asn into the input field ", () => {
    const asnWithoutSlashes = "1101ZD0100000448754K"
    const asnWithSlashes = "11/01ZD/01/00000448754K"

    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.intercept("PUT", `/bichard/api/court-cases/0/update`).as("update")

    cy.get("input#asn").clear()
    cy.get("input#asn").type(asnWithoutSlashes)
    cy.get("input#asn").should("have.value", asnWithSlashes)

    cy.wait("@update")
    cy.get(".asn-row .success-message").contains("Input saved").should("exist")

    clickTab("Notes")
    cy.get(".notes-table")
      .find(
        `td:contains("GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: ${asnWithoutSlashes}")`
      )
      .should("have.length", 1)

    clickTab("Defendant")

    cy.get("input#asn").type("{backspace}")
    cy.get("input#asn").type("K")

    cy.get("@update.all").then((interceptions) => expect(interceptions).to.have.length(1))

    clickTab("Notes")
    cy.get(".notes-table")
      .find(`td:contains("GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: ${asnWithSlashes}")`)
      .should("have.length", 0)
  })

  it("should display the updated ASN after submission along with CORRECTION badge", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get(".defendant-details-table").contains("AAAAAAAAAAAAAAAAAAA")
    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    submitAndConfirmExceptions()

    cy.get(".defendant-details-table").contains("1101ZD0100000448754K")
    cy.get(".moj-badge").contains("Correction").should("exist")
  })

  it("should display error when invalid ASN is entered", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD01448754")

    cy.get(".defendant-details-table").find(".warning-icon").should("exist")
    cy.get(".defendant-details-table").contains("Enter ASN in the correct format")
  })

  it("Should not be able to edit ASN field if case is not locked by the current user", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "BichardForce02"
      }
    ])
    loginAndVisit("/bichard/court-cases/0")

    cy.get("input#asn").should("not.exist")
  })

  it("Should not be able to edit ASN field if user is not an exception handler", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "TriggerHandler"
      }
    ])
    loginAndVisit("TriggerHandler", "/bichard/court-cases/0")

    cy.get(".moj-badge").should("not.exist")
    cy.get("input#asn").should("not.exist")
  })

  it("Should not display an editable field for ASN when exceptionsEnabled is false for user", () => {
    loginAndVisit("NoExceptionsFeatureFlag", "/bichard/court-cases/0")

    cy.get("input#asn").should("not.exist")
  })

  describe("when I submit resolved exceptions I should not see the same value in the notes", () => {
    it("Should validate and auto-save the ASN correction and only update notes once", () => {
      const errorId = 0
      const updatedAsn = "1101ZD0100000410836V"

      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
          updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])
      cy.intercept("PUT", `/bichard/api/court-cases/${errorId}/update`).as("save")

      loginAndVisit(`/bichard/court-cases/${errorId}`)

      cy.get("button").contains("Submit exception(s)").should("be.enabled")
      cy.get("#asn").clear()

      cy.get("#asn").type(updatedAsn)

      cy.wait("@save")

      cy.get(".asn-row .success-message").contains("Input saved").should("exist")
      cy.get("button").contains("Submit exception(s)").should("be.enabled")

      clickTab("Notes")
      cy.get(".notes-table")
        .find(`td:contains("GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: ${updatedAsn}")`)
        .should("have.length", 1)

      submitAndConfirmExceptions()

      clickTab("Notes")
      cy.get(".notes-table")
        .find(`td:contains("GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: ${updatedAsn}")`)
        .should("have.length", 1)
    })
  })
})
