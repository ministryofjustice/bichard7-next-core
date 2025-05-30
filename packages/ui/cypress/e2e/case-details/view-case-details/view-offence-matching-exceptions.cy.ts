import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { clickTab, loginAndVisit } from "../../../support/helpers"

// exceptions here can be removed as suites are added for offence matching
describe("View offence matching exceptions", () => {
  ;[
    { asn: ExceptionCode.HO100304, firstOffenceBadge: "Unmatched" },
    { asn: ExceptionCode.HO100328, firstOffenceBadge: "Unmatched" },
    { asn: ExceptionCode.HO100507, firstOffenceBadge: "Added by Court", secondOffenceBadge: "Added by Court" },
    { offenceReasonSequence: ExceptionCode.HO100203, firstOffenceBadge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100228, firstOffenceBadge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100311, firstOffenceBadge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100312, firstOffenceBadge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100320, firstOffenceBadge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100329, firstOffenceBadge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100333, firstOffenceBadge: "Unmatched" }
  ].forEach(({ asn, offenceReasonSequence, firstOffenceBadge = "Matched", secondOffenceBadge = "Unmatched" }) => {
    it(`Should display the correct error for ${asn ?? offenceReasonSequence}`, () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCaseWithFieldsWithExceptions", {
        case: {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "01"
        },
        exceptions: {
          asn,
          offenceReasonSequence
        }
      })

      loginAndVisit("Supervisor", "/bichard/court-cases/0")

      clickTab("Offences")

      cy.get("tbody tr:nth-child(1) td:nth-child(5) a").click()

      cy.get(`[data-testid="offence-details-1"]`).should("have.text", "Offence 1 of 2")
      cy.contains("dt", "Offence code").siblings().contains("TH68010")
      cy.contains("dt", "PNC sequence number").siblings().contains(firstOffenceBadge)

      cy.get("button").contains("Next offence").click()
      cy.get(`[data-testid="offence-details-2"]`).should("have.text", "Offence 2 of 2")
      cy.contains("dt", "Offence code").siblings().contains("TH68010")
      cy.contains("dt", "PNC sequence number").siblings().contains(secondOffenceBadge)
    })
  })
})
