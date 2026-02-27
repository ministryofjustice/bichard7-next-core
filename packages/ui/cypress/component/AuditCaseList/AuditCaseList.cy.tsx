import type { AuditCaseDto } from "@moj-bichard7/common/types/AuditCase"
import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"

import { MockNextRouter } from "../../support/MockNextRouter"
import AuditCaseList from "features/AuditCaseList/AuditCaseList"

import "../../../styles/globals.scss"

describe("AuditCaseList", () => {
  it("renders the message for no rows found", () => {
    cy.mount(
      <MockNextRouter>
        <AuditCaseList auditId={1} auditCases={[]} />
      </MockNextRouter>
    )

    cy.contains("No court cases found for this audit")
  })

  it("renders the row", () => {
    const auditCases: AuditCaseDto[] = [
      {
        asn: "test asn",
        courtDate: new Date(),
        courtName: "Court Name",
        ptiurn: "Case0001",
        defendantName: "Test Defendant",
        errorId: 1,
        errorQualityChecked: 1,
        errorStatus: ResolutionStatus.Unresolved,
        messageReceivedTimestamp: new Date(),
        noteCount: 0,
        notes: [],
        resolutionTimestamp: new Date(),
        triggerQualityChecked: 1,
        triggerStatus: ResolutionStatus.Unresolved
      }
    ]

    cy.mount(
      <MockNextRouter>
        <AuditCaseList auditId={1} auditCases={auditCases} />
      </MockNextRouter>
    )

    cy.get("tbody > tr").should("have.length", 1)
    cy.contains(auditCases[0].defendantName!)
  })
})
