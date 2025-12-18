import HO100206 from "../../../../../../test/test-data/HO100206.json"
import HO100300 from "../../../../../../test/test-data/HO100300.json"
import HO100301 from "../../../../../../test/test-data/HO100301.json"
import HO100304 from "../../../../../../test/test-data/HO100304.json"
import HO100314 from "../../../../../../test/test-data/HO100314.json"
import HO100321 from "../../../../../../test/test-data/HO100321.json"
import { loginAndVisit, refreshUntilNotePresent, verifyUpdatedMessage } from "../../../../../support/helpers"

describe("exceptions", () => {
  function submitEditableAsnExceptionAmendment(exception: { hearingOutcomeXml: string }, asn: string) {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: exception.hearingOutcomeXml,
        updatedHearingOutcome: exception.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type(asn)

    cy.get("button").contains("Submit exception(s)").click()

    cy.contains(
      "Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"
    ).should("exist")
    cy.get("button").contains("Submit exception(s)").click()

    cy.pollUntilElementExists(".moj-badge:contains('Submitted')")

    cy.contains(`GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: ${asn}`)

    refreshUntilNotePresent("GeneralHandler: Portal Action: Resubmitted Message.")
  }

  it("Should be able to edit ASN field if HO100206 is raised", () => {
    submitEditableAsnExceptionAmendment(HO100206, "1101ZD0100000448754K")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>AAAAAAAAAAAAAAAAAAAA</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should be able to edit ASN field if HO100300 is raised", () => {
    submitEditableAsnExceptionAmendment(HO100300, "1101ZD0100000448754K")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>2006MM0600000003131B</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should be able to edit ASN field if HO100301 is raised", () => {
    submitEditableAsnExceptionAmendment(HO100301, "1101ZD0100000448754K")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>2006MM0600000003131B</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should be able to edit ASN field if HO100314 is raised", () => {
    submitEditableAsnExceptionAmendment(HO100314, "1101ZD0100000448754K")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>AAAAAAAAAAAAAAAAAAAA</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should be able to edit ASN field if HO100304 is raised", () => {
    submitEditableAsnExceptionAmendment(HO100304, "1101ZD0100000448754K")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>AAAAAAAAAAAAAAAAAAAA</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should be able to edit ASN field if HO100321 is raised", () => {
    submitEditableAsnExceptionAmendment(HO100321, "1101ZD0100000448754K")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>AAAAAAAAAAAAAAAAAAAA</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })
})
