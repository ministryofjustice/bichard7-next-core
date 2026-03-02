import { MockNextRouter } from "../../support/MockNextRouter"

import "../../../styles/globals.scss"
import { Table } from "../../../src/components/Table"
import { AuditCaseListTableHeader } from "../../../src/features/AuditCaseList/AuditCaseListTableHeader"

describe("AuditCaseListTableHeader", () => {
  it("pushed field to router when clicked", () => {
    const pushSpy = cy.spy().as("routerPush")

    cy.mount(
      <MockNextRouter push={pushSpy}>
        <Table>
          <AuditCaseListTableHeader order="asc" />
        </Table>
      </MockNextRouter>
    )

    cy.get("button#defendant-name-sort").click()
    cy.get("@routerPush").should("be.calledWith", "?orderBy=defendantName&order=asc")
  })
})
