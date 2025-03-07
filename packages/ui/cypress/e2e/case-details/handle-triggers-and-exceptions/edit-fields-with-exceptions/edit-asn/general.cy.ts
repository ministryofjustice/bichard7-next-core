import Asn from "services/Asn"
import AnnotatedHO from "../../../../../../test/test-data/AnnotatedHO1.json"
import HO100206 from "../../../../../../test/test-data/HO100206.json"
import ExceptionHO100239 from "../../../../../../test/test-data/HO100239_1.json"
import HO100300 from "../../../../../../test/test-data/HO100300.json"
import { clickTab, loginAndVisit, submitAndConfirmExceptions } from "../../../../../support/helpers"

describe("ASN", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
  })

  it("Should not be able to edit ASN field when there is no relevant exception", () => {
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
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
        errorCount: 1
      },
      {
        errorStatus: "Resolved",
        errorId: resolvedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
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

  it("Should not be able to edit ASN field if irrelevant exception is raised", () => {
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

  it("Should default the ASN editable field value to defendant ASN when ASN is editable but not invalid", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: HO100300.hearingOutcomeXml,
        updatedHearingOutcome: HO100300.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")
    cy.get("#asn").should("have.value", Asn.divideAsn("1101ZD0100000448700B"))
  })

  it("should display the updated ASN after submission along with CORRECTION badge", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get(".defendant-details-table").contains("AA/AAAA/AA/AAAAAAAAAAA")
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
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
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
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "TriggerHandler"
      }
    ])
    loginAndVisit("TriggerHandler", "/bichard/court-cases/0")

    cy.get(".moj-badge").should("not.exist")
    cy.get("input#asn").should("not.exist")
  })

  describe("when I submit resolved exceptions I should not see the same value in the notes", () => {
    it("Should validate and auto-save the ASN correction and only update notes once", () => {
      const errorId = 0
      const updatedAsn = "1101ZD0100000410836V"

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
