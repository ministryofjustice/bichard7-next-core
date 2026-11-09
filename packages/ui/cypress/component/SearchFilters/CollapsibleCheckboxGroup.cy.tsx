import { CheckboxOption } from "@/components/Details/CollapsibleCheckboxList"
import CollapsibleCheckboxGroup from "@/components/SearchFilters/CollapsibleCheckboxGroup"

describe("CollapsibleCheckboxGroup", () => {
  const mockOptions: CheckboxOption[] = [
    { id: "1", label: "User Alpha" },
    { id: "2", label: "User Beta" },
    { id: "3", label: "User Gamma" }
  ]

  const allCheckboxSelector = '[data-testid="checkbox-all"]'
  const summarySelector = "summary"
  const childCheckboxSelector = 'input[type="checkbox"]:not([data-testid="checkbox-all"])'

  const openDetails = () => {
    cy.get(summarySelector).click()
  }

  it('renders correctly with "All" checked when all options are initially selected', () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")

    cy.mount(
      <CollapsibleCheckboxGroup
        allOptions={mockOptions}
        selected={["1", "2", "3"]}
        allCheckboxLabel="Resolvers"
        onChange={onChangeSpy}
      />
    )

    cy.get(allCheckboxSelector).should("be.checked")
    cy.contains("label", "All Resolvers").should("be.visible")

    openDetails()
    cy.get(childCheckboxSelector).each(($el) => {
      cy.wrap($el).should("be.checked")
    })
  })

  it('renders with "All" unchecked when only a subset of options is selected', () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")

    cy.mount(
      <CollapsibleCheckboxGroup
        allOptions={mockOptions}
        selected={["1"]}
        allCheckboxLabel="Resolvers"
        onChange={onChangeSpy}
      />
    )

    cy.get(allCheckboxSelector).should("not.be.checked")

    openDetails()
    cy.get(`${childCheckboxSelector}[value="1"]`).should("be.checked")
    cy.get(`${childCheckboxSelector}[value="2"]`).should("not.be.checked")
    cy.get(`${childCheckboxSelector}[value="3"]`).should("not.be.checked")
  })

  it('checks all child checkboxes and triggers onChange with all IDs when "All" is clicked', () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")

    cy.mount(
      <CollapsibleCheckboxGroup
        allOptions={mockOptions}
        selected={[]}
        allCheckboxLabel="Resolvers"
        onChange={onChangeSpy}
      />
    )

    openDetails()
    cy.get(allCheckboxSelector).check()

    cy.get(childCheckboxSelector).each(($el) => {
      cy.wrap($el).should("be.checked")
    })

    cy.get("@onChangeSpy").should("have.been.calledWithMatch", ["1", "2", "3"])
  })

  it('unchecks all child checkboxes and passes an empty array when "All" is unchecked', () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")

    cy.mount(
      <CollapsibleCheckboxGroup
        allOptions={mockOptions}
        selected={["1", "2", "3"]}
        allCheckboxLabel="Resolvers"
        onChange={onChangeSpy}
      />
    )

    openDetails()
    cy.get(allCheckboxSelector).uncheck()

    cy.get(childCheckboxSelector).each(($el) => {
      cy.wrap($el).should("not.be.checked")
    })

    cy.get("@onChangeSpy").should("have.been.calledWith", [])
  })

  it('automatically checks "All" when the remaining unchecked child boxes are selected', () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")

    cy.mount(
      <CollapsibleCheckboxGroup
        allOptions={mockOptions}
        selected={["1", "2"]}
        allCheckboxLabel="Resolvers"
        onChange={onChangeSpy}
      />
    )

    openDetails()
    cy.get(allCheckboxSelector).should("not.be.checked")

    cy.get(`${childCheckboxSelector}[value="3"]`).check()

    cy.get(allCheckboxSelector).should("be.checked")
    cy.get("@onChangeSpy").should("have.been.calledWithMatch", ["1", "2", "3"])
  })

  it('unchecks "All" when one child checkbox is deselected', () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")

    cy.mount(
      <CollapsibleCheckboxGroup
        allOptions={mockOptions}
        selected={["1", "2", "3"]}
        allCheckboxLabel="Resolvers"
        onChange={onChangeSpy}
      />
    )

    openDetails()
    cy.get(allCheckboxSelector).should("be.checked")

    cy.get(`${childCheckboxSelector}[value="1"]`).uncheck()

    cy.get(allCheckboxSelector).should("not.be.checked")
    cy.get("@onChangeSpy").should("have.been.calledWithMatch", ["2", "3"])
  })
})
