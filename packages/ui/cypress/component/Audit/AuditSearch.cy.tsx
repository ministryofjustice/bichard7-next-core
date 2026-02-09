import AuditSearch from "../../../src/features/AuditSearch/AuditSearch"
import { subDays, format } from "date-fns"

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

  it("lists volume options with 20% as default", () => {
    cy.mount(<AuditSearch triggerTypes={[]} resolvedBy={[]} />)

    cy.get("#audit-search-volume input[type=radio]").should("have.length", 4)

    cy.get("label[for=audit-volume-10]").should("have.text", "10% of cases")
    cy.get("label[for=audit-volume-20]").should("have.text", "20% of cases")
    cy.get("label[for=audit-volume-50]").should("have.text", "50% of cases")
    cy.get("label[for=audit-volume-100]").should("have.text", "100% of cases")

    cy.get("#audit-volume-20").should("be.checked")
  })

  it("defaults from date and to date to be the past week", () => {
    cy.mount(<AuditSearch triggerTypes={[]} resolvedBy={[]} />)

    const fromStr = format(subDays(new Date(), 7), "yyyy-MM-dd")
    const toStr = format(new Date(), "yyyy-MM-dd")

    cy.get("#audit-date-from").should("have.value", fromStr)
    cy.get("#audit-date-to").should("have.value", toStr)
  })

  it("allows dates to be specified in the past", () => {
    cy.mount(<AuditSearch triggerTypes={[]} resolvedBy={[]} />)

    const str = format(subDays(new Date(), 4), "yyyy-MM-dd")

    cy.get("#audit-date-from").type(str)
    cy.get("#audit-date-from").should("have.value", str)

    cy.get("#audit-date-to").type(str)
    cy.get("#audit-date-to").should("have.value", str)
  })

  it("should reset cleared dates to today", () => {
    cy.mount(<AuditSearch triggerTypes={[]} resolvedBy={[]} />)

    const todayStr = format(new Date(), "yyyy-MM-dd")

    cy.get("#audit-date-from").clear()
    cy.get("#audit-date-from").should("have.value", todayStr)

    cy.get("#audit-date-to").clear()
    cy.get("#audit-date-to").should("have.value", todayStr)
  })
})
