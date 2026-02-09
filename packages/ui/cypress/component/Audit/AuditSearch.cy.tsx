import AuditSearch from "../../../src/features/AuditSearch/AuditSearch"

describe("AuditSearch", () => {
  it("mounts", () => {
    cy.mount(
      <AuditSearch triggerTypes={["TRPR0010"]} resolvedBy={[{ username: "usera", forenames: "User", surname: "A" }]} />
    )
  })

  it("lists resolvers", () => {
    cy.mount(
      <AuditSearch
        triggerTypes={[]}
        resolvedBy={[
          { username: "usera", forenames: "Example User", surname: "A" },
          { username: "userb", forenames: "Another", surname: "User-B" }
        ]}
      />
    )

    cy.get("#audit-search-resolved-by input[type=checkbox]").should("have.length", 2)
    cy.get("label[for=audit-resolved-by-0]").should("have.text", "Example User A")
    cy.get("label[for=audit-resolved-by-1]").should("have.text", "Another User-B")
  })

  it("lists triggers", () => {
    cy.mount(<AuditSearch triggerTypes={["TRPR0001", "TRPR0003"]} resolvedBy={[]} />)

    cy.get("#audit-search-triggers input[type=checkbox]").should("have.length", 2)
    cy.get("label[for=audit-trigger-type-0]").should("have.text", "TRPR0001")
    cy.get("label[for=audit-trigger-type-1]").should("have.text", "TRPR0003")
  })
})
