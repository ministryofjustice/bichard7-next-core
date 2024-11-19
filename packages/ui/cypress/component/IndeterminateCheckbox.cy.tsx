import IndeterminateCheckbox from "components/IndeterminateCheckbox"
import { Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

describe("IndeterminateCheckbox", () => {
  const handleDispatch = () => {}

  it("renders with the unchecked state", () => {
    cy.mount(
      <IndeterminateCheckbox
        checkedValue={false}
        dispatch={handleDispatch}
        id={"bails"}
        indeterminate={false}
        labelText={"Bails"}
        value={"bails"}
      />
    )

    cy.get("input#bails").should("not.be.checked")
  })

  it("renders with the checked state", () => {
    cy.mount(
      <IndeterminateCheckbox
        checkedValue={true}
        dispatch={handleDispatch}
        id={"bails"}
        indeterminate={false}
        labelText={"Bails"}
        value={"bails"}
      />
    )

    cy.get("input#bails").should("be.checked")
  })

  it("renders with the indeterminate state with the checkedValue not matching the value", () => {
    cy.mount(
      <IndeterminateCheckbox
        checkedValue={false}
        dispatch={handleDispatch}
        id={"bails"}
        indeterminate={true}
        labelText={"Bails"}
        value={"bails"}
      />
    )

    cy.get("input#bails").should("not.be.checked")
    cy.get("input#bails:indeterminate").should("exist")
  })

  it("renders with the indeterminate state with the checkedValue matching the value", () => {
    cy.mount(
      <IndeterminateCheckbox
        checkedValue={false}
        dispatch={handleDispatch}
        id={"bails"}
        indeterminate={true}
        labelText={"Bails"}
        value={"bails"}
      />
    )

    cy.get("input#bails").should("not.be.checked")
    cy.get("input#bails:indeterminate").should("exist")
  })

  it("responds to being checked", () => {
    const handleDispatchForChecked: Dispatch<FilterAction> = (action: FilterAction) => {
      const { method, type, value } = action
      expect(method).to.equals("add")
      expect(type).to.equals("triggerIndeterminate")
      expect(value).to.equals("bails")
    }

    cy.mount(
      <IndeterminateCheckbox
        checkedValue={false}
        dispatch={handleDispatchForChecked}
        id={"bails"}
        indeterminate={false}
        labelText={"Bails"}
        value={"bails"}
      />
    )

    cy.get("input#bails").click()
  })

  it("responds to being unchecked", () => {
    const handleDispatchForUnchecked: Dispatch<FilterAction> = (action: FilterAction) => {
      const { method, type, value } = action
      expect(method).to.equals("remove")
      expect(type).to.equals("triggerIndeterminate")
      expect(value).to.equals("bails")
    }

    cy.mount(
      <IndeterminateCheckbox
        checkedValue={true}
        dispatch={handleDispatchForUnchecked}
        id={"bails"}
        indeterminate={false}
        labelText={"Bails"}
        value={"bails"}
      />
    )

    cy.get("input#bails").click()
  })

  it("responds to being clicked in indeterminate set", () => {
    const handleDispatchForIndeterminate: Dispatch<FilterAction> = (action: FilterAction) => {
      const { method, type, value } = action
      expect(method).to.equals("remove")
      expect(type).to.equals("triggerIndeterminate")
      expect(value).to.equals("bails")
    }

    cy.mount(
      <IndeterminateCheckbox
        checkedValue={true}
        dispatch={handleDispatchForIndeterminate}
        id={"bails"}
        indeterminate={true}
        labelText={"Bails"}
        value={"bails"}
      />
    )

    cy.get("input#bails").click()
  })
})
