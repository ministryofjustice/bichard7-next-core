import React from "react"
import type { TotalColumnConfig } from "types/reports/Config"
import { Totals } from "components/Reports/Totals"

describe("<Totals />", () => {
  const mockConfig: TotalColumnConfig[] = [
    { key: "exceptionsResolved", label: "Exceptions Resolved" },
    { key: "triggersResolved", label: "Triggers Resolved" },
    { key: "locked", label: "Exceptions/Triggers Locked" }
  ]

  const mockTotals: Record<string, unknown> = {
    exceptionsResolved: 8,
    triggersResolved: 20
  }

  it("renders nothing if totalsConfig is not provided", () => {
    cy.mount(<Totals totals={mockTotals} />)

    cy.get("span").should("not.exist")
  })

  it("renders nothing if totals data is not provided", () => {
    cy.mount(<Totals totalsConfig={mockConfig} />)

    cy.get("span").should("not.exist")
  })

  it("renders labels and values correctly based on the config", () => {
    cy.mount(<Totals totalsConfig={mockConfig} totals={mockTotals} />)

    cy.contains("span", "Exceptions Resolved: 8").should("be.visible")
    cy.contains("span", "Triggers Resolved: 20").should("be.visible")
  })

  it("falls back to '0' if a key in the config does not exist in the totals object", () => {
    cy.mount(<Totals totalsConfig={mockConfig} totals={mockTotals} />)

    cy.contains("span", "Exceptions/Triggers Locked: 0").should("be.visible")
  })

  it("applies the correct GOV.UK typography and spacing classes", () => {
    cy.mount(<Totals totalsConfig={mockConfig} totals={mockTotals} />)

    cy.get("span").each(($el) => {
      cy.wrap($el).should("have.class", "govuk-body")
      cy.wrap($el).should("have.class", "govuk-!-margin-left-3")
      cy.wrap($el).should("have.class", "govuk-!-margin-right-3")
    })
  })
})
