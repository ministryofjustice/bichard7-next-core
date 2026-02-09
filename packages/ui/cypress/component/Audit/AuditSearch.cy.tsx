import AuditSearch from "../../../src/features/AuditSearch/AuditSearch"

describe("AuditSearch", () => {
  it("mounts", () => {
    cy.mount(
      <AuditSearch triggerTypes={["TRPR0010"]} resolvedBy={[{ username: "usera", forenames: "User", surname: "A" }]} />
    )
  })

  it("lists triggers", () => {
    cy.mount(
      <AuditSearch
        triggerTypes={["TRPR0001", "TRPR0003"]}
        resolvedBy={[{ username: "usera", forenames: "User", surname: "A" }]}
      />
    )

    cy.get("#trigger-filters input[type=checkbox]").should("have.length", "2")
    cy.get("label[for=audit-trigger-type-0]").should("have.text", "TRPR0001")
    cy.get("label[for=audit-trigger-type-1]").should("have.text", "TRPR0003")
  })
})
