import React from "react"
import { ReportConfig } from "types/reports/Config"
import { ReportTable } from "features/ReportSelectionFilter/ReportTable"

const mockRows = [
  { id: "1", data: "value 1" },
  { id: "2", data: "value 2" }
]

const simpleConfig = {
  isGrouped: false
} as ReportConfig

const groupedConfig = {
  isGrouped: true
} as ReportConfig

describe("ReportTable", () => {
  it("renders nothing when config is null", () => {
    cy.mount(
      <div data-testid="mount-wrapper">
        <ReportTable config={null} rows={mockRows} tableName="Test Table" />
      </div>
    )
    cy.get('[data-testid="mount-wrapper"]').should("be.empty")
  })

  it("renders nothing when rows array is empty", () => {
    cy.mount(
      <div data-testid="mount-wrapper">
        <ReportTable config={simpleConfig} rows={[]} tableName="Test Table" />
      </div>
    )
    cy.get('[data-testid="mount-wrapper"]').should("be.empty")
  })

  it("mounts and renders SimpleTable when config.isGrouped is falsy", () => {
    cy.mount(<ReportTable config={simpleConfig} rows={mockRows} tableName="Simple Table" />)
  })

  it("mounts and renders GroupTable when config.isGrouped is true", () => {
    cy.mount(<ReportTable config={groupedConfig} rows={mockRows} tableName="Group Table" />)
  })
})
