import { CheckboxOption, default as CollapsibleCheckboxList } from "@/components/Details/CollapsibleCheckboxList"
import React from "react"

describe("CollapsibleCheckboxList", () => {
  const mockOptions: CheckboxOption[] = [
    { id: "opt-1", label: "Option One" },
    { id: "opt-2", label: "Option Two" },
    { id: "opt-3", label: "Option Three" }
  ]

  const createRefObject = (): React.RefObject<HTMLInputElement[]> => ({
    current: []
  })

  it("renders nothing when allOptions is empty", () => {
    const refs = createRefObject()

    cy.mount(
      <CollapsibleCheckboxList
        summary="View options"
        detailsId="test-details"
        allOptions={[]}
        refs={refs}
        selected={[]}
        idPrefix="res-"
        onCheckboxChange={() => {}}
      />
    )

    cy.get("details").should("not.exist")
    cy.get("summary").should("not.exist")
  })

  it("renders details summary and populates checkboxes with default checked state", () => {
    const refs = createRefObject()

    cy.mount(
      <CollapsibleCheckboxList
        summary="Toggle Users"
        detailsId="users-details"
        allOptions={mockOptions}
        refs={refs}
        selected={["opt-1", "opt-3"]}
        idPrefix="user-chk-"
        keyPrefix="user-chk-"
        onCheckboxChange={() => {}}
      />
    )

    cy.contains("summary", "Toggle Users").click()

    cy.get('[data-testid="user-chk-0"]').should("have.id", "user-chk-0").and("have.value", "opt-1").and("be.checked")

    cy.get('[data-testid="user-chk-1"]')
      .should("have.id", "user-chk-1")
      .and("have.value", "opt-2")
      .and("not.be.checked")

    cy.get('[data-testid="user-chk-2"]').should("have.id", "user-chk-2").and("have.value", "opt-3").and("be.checked")

    cy.contains("label", "Option One").should("be.visible")
    cy.contains("label", "Option Two").should("be.visible")
    cy.contains("label", "Option Three").should("be.visible")
  })

  it("populates refs object", () => {
    const refs = createRefObject()

    cy.mount(
      <CollapsibleCheckboxList
        summary="Options"
        detailsId="ref-test-details"
        allOptions={mockOptions}
        refs={refs}
        selected={["opt-1"]}
        idPrefix="chk-"
        onCheckboxChange={() => {}}
      />
    )

    cy.get("summary").click()

    cy.get('input[type="checkbox"]').should("have.length", mockOptions.length)

    cy.wrap(refs).should((r) => {
      expect(r.current).to.have.length(3)
      expect(r.current[0].value).to.equal("opt-1")
      expect(r.current[1].value).to.equal("opt-2")
      expect(r.current[2].value).to.equal("opt-3")
      expect(r.current[0].checked).to.equal(true)
      expect(r.current[1].checked).to.equal(false)
      expect(r.current[2].checked).to.equal(false)
    })
  })

  it("applies key prefix to data-testid attributes", () => {
    const refs = createRefObject()

    cy.mount(
      <CollapsibleCheckboxList
        summary="Prefix Check"
        detailsId="prefix-details"
        allOptions={mockOptions}
        refs={refs}
        selected={[]}
        keyPrefix="filter-"
        idPrefix="res-"
        onCheckboxChange={() => {}}
      />
    )

    cy.get("summary").click()
    cy.get('[data-testid="filter-0"]').should("exist")
    cy.get('[data-testid="filter-1"]').should("exist")
    cy.get('[data-testid="filter-2"]').should("exist")
  })

  it("triggers onCheckboxChange handler when a checkbox is clicked", () => {
    const refs = createRefObject()
    const onChangeSpy = cy.spy().as("onChangeSpy")

    cy.mount(
      <CollapsibleCheckboxList
        summary="Click Check"
        detailsId="click-details"
        allOptions={mockOptions}
        refs={refs}
        selected={[]}
        idPrefix="chk-"
        keyPrefix="checkbox-"
        onCheckboxChange={onChangeSpy}
      />
    )

    cy.get("summary").click()
    cy.get('[data-testid="checkbox-0"]').click()

    cy.get("@onChangeSpy").should("have.been.calledOnce")
  })
})
