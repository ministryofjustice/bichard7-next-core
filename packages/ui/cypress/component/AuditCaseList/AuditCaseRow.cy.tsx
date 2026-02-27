import type { AuditCaseDto } from "@moj-bichard7/common/types/AuditCase"
import type { Note } from "@moj-bichard7/common/types/Note"

import { AuditCaseRow } from "features/AuditCaseList/AuditCaseRow"
import { MockNextRouter } from "../../support/MockNextRouter"

import "../../../styles/globals.scss"
import { Table, TableBody } from "../../../src/components/Table"

describe("AuditCaseRow", () => {
  const auditId = 1
  const auditCase = {
    asn: "test asn",
    courtDate: new Date(),
    courtName: "Court Name",
    ptiurn: "Case0001",
    defendantName: "Test Defendant",
    errorId: 1,
    errorQualityChecked: 1,
    messageReceivedTimestamp: new Date(),
    noteCount: 0,
    notes: [],
    resolutionTimestamp: new Date(),
    triggerQualityChecked: 1,
    triggerStatus: "Resolved"
  } as AuditCaseDto

  function mount(auditId: number, auditCase: AuditCaseDto) {
    cy.mount(
      <MockNextRouter>
        <Table>
          <TableBody>
            <AuditCaseRow auditId={auditId} auditCase={auditCase} />
          </TableBody>
        </Table>
      </MockNextRouter>
    )
  }

  it("shows the defendant name", () => {
    mount(auditId, auditCase)

    cy.contains(auditCase.defendantName!)
  })

  it("has the correct links to the case details page", () => {
    mount(auditId, auditCase)

    const expectedHref = `/court-cases/${auditCase.errorId}?prev=/audit/${auditId}`

    cy.get("a#defendant-name-link").should("have.attr", "href", expectedHref)
    cy.get("a#asn-link").should("have.attr", "href", expectedHref)
  })

  it("should not show note preview when notes are not present", () => {
    mount(auditId, { ...auditCase, noteCount: 0, notes: [] })

    cy.get("button.preview-button").should("not.exist")
  })

  it("shows preview when notes are present", () => {
    mount(auditId, { ...auditCase, noteCount: 1, notes: [{ createdAt: new Date(), noteText: "Test note" } as Note] })

    cy.get("button.preview-button").should("be.visible")
  })

  it("clicking note preview should show notes", () => {
    mount(auditId, { ...auditCase, noteCount: 1, notes: [{ createdAt: new Date(), noteText: "Test note" } as Note] })

    cy.get("button.preview-button").click()
    cy.contains("Test note")
  })
})
