import ResolveByFilter from "@/components/SearchFilters/ResolvedByFilter"

describe("ResolveByFilter Component", () => {
  const mockResolvers = [
    { username: "user1", forenames: "John", surname: "Doe", deleted: false },
    { username: "user2", forenames: "Jane", surname: "Smith", deleted: false },
    { username: "user3", forenames: "Bob", surname: "Brown", deleted: true }
  ]

  it("renders active resolvers and hides deleted ones by default", () => {
    cy.mount(<ResolveByFilter resolvedBy={[]} resolvers={mockResolvers} onChange={cy.spy().as("onChangeSpy")} />)

    cy.get("[data-testid='audit-resolved-by-all']").should("exist")
    cy.get("label[for='_r_0_']").should("contain.text", "All active users")

    cy.get("[data-testid='audit-resolved-by-0']").should("exist")
    cy.get("label[for='resolvers0']").should("contain.text", "John Doe")

    cy.get("[data-testid='audit-resolved-by-1']").should("exist")
    cy.get("label[for='resolvers1']").should("contain.text", "Jane Smith")

    cy.get("details.govuk-details").should("not.have.attr", "open")
  })

  it("checks checkboxes based on resolvedBy prop", () => {
    cy.mount(<ResolveByFilter resolvedBy={["user1"]} resolvers={mockResolvers} />)

    cy.get("[data-testid='audit-resolved-by-0']").should("be.checked")
    cy.get("[data-testid='audit-resolved-by-1']").should("not.be.checked")
    cy.get("[data-testid='audit-resolved-by-all']").should("not.be.checked")
  })

  it("calls onChange with all active users when the all checkbox is clicked", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")
    cy.mount(<ResolveByFilter resolvedBy={[]} resolvers={mockResolvers} onChange={onChangeSpy} />)

    cy.get("[data-testid='audit-resolved-by-all']").check()
    cy.get("@onChangeSpy").should("have.been.calledWith", ["user1", "user2"])
  })

  it("toggles individual active checkboxes and updates all checkbox state", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")
    cy.mount(<ResolveByFilter resolvedBy={["user1"]} resolvers={mockResolvers} onChange={onChangeSpy} />)

    cy.get("[data-testid='audit-resolved-by-1']").check()
    cy.get("@onChangeSpy").should("have.been.calledWith", ["user1", "user2"])
    cy.get("[data-testid='audit-resolved-by-all']").should("be.checked")

    cy.get("[data-testid='audit-resolved-by-0']").uncheck()
    cy.get("@onChangeSpy").should("have.been.calledWith", ["user2"])
    cy.get("[data-testid='audit-resolved-by-all']").should("not.be.checked")
  })

  it("toggles all checkbox when all other checkboxes are checked", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")
    cy.mount(<ResolveByFilter resolvedBy={[]} resolvers={mockResolvers} onChange={onChangeSpy} />)

    cy.get("[data-testid='audit-resolved-by-1']").check()
    cy.get("[data-testid='audit-resolved-by-0']").check()

    cy.get("[data-testid='audit-resolved-by-all']").should("be.checked")
  })

  it("reveals and toggles deleted users", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")
    cy.mount(<ResolveByFilter resolvedBy={[]} resolvers={mockResolvers} onChange={onChangeSpy} />)

    cy.get("details.govuk-details").should("not.have.attr", "open")
    cy.get("summary.govuk-details__summary").click()
    cy.get("details.govuk-details").should("have.attr", "open")

    cy.get("[data-testid='audit-resolved-by-deleted-0']").check()
    cy.get("@onChangeSpy").should("have.been.calledWith", ["user3"])
  })
})
