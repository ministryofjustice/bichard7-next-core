import AuditSearch from "../../../src/features/AuditSearch/AuditSearch"
import { subDays, format } from "date-fns"
import { MockNextRouter } from "../../support/MockNextRouter"

describe("AuditSearch", () => {
  it("mounts", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch triggerTypes={["TRPR0010"]} resolvers={[{ username: "usera", forenames: "User", surname: "A" }]} />
      </MockNextRouter>
    )
  })

  it("should list resolvers", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch
          triggerTypes={[]}
          resolvers={[
            { username: "usera", forenames: "Example User", surname: "A" },
            { username: "userb", forenames: "Another", surname: "User-B" }
          ]}
        />
      </MockNextRouter>
    )

    cy.get("#audit-search-resolved-by input[type=checkbox]").should("have.length", 3)

    cy.get("#audit-search-resolved-by label").contains("Example User A").should("exist")
    cy.get("#audit-search-resolved-by label").contains("Another User-B").should("exist")
  })

  it("should list triggers", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch triggerTypes={["TRPR0001", "TRPR0003"]} resolvers={[]} />
      </MockNextRouter>
    )

    cy.get("#audit-search-triggers input[type=checkbox]").should("have.length", 2)

    cy.get("#audit-search-triggers label").contains("TRPR0001").should("exist")
    cy.get("#audit-search-triggers label").contains("TRPR0003").should("exist")
  })

  it("should list volume options with 20% as default", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch triggerTypes={[]} resolvers={[]} />
      </MockNextRouter>
    )

    cy.get("#audit-search-volume input[type=radio]").should("have.length", 4)

    cy.get("#audit-volume-10").should("have.value", "10")
    cy.get("#audit-volume-20").should("have.value", "20")
    cy.get("#audit-volume-50").should("have.value", "50")
    cy.get("#audit-volume-100").should("have.value", "100")

    cy.get("#audit-volume-20").should("be.checked")
  })

  it("should default from date and to date to be the past week", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch triggerTypes={[]} resolvers={[]} />
      </MockNextRouter>
    )

    const fromStr = format(subDays(new Date(), 7), "yyyy-MM-dd")
    const toStr = format(new Date(), "yyyy-MM-dd")

    cy.get("[data-testid='audit-date-from']").should("have.value", fromStr)
    cy.get("[data-testid='audit-date-to']").should("have.value", toStr)
  })

  it("should allow dates to be specified in the past", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch triggerTypes={[]} resolvers={[]} />
      </MockNextRouter>
    )

    const str = format(subDays(new Date(), 4), "yyyy-MM-dd")

    cy.get("[data-testid='audit-date-from']").type(str)
    cy.get("[data-testid='audit-date-from']").should("have.value", str)

    cy.get("[data-testid='audit-date-to']").type(str)
    cy.get("[data-testid='audit-date-to']").should("have.value", str)
  })

  it("should allow toggling include flags", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch triggerTypes={[]} resolvers={[]} />
      </MockNextRouter>
    )

    cy.get("label").contains("Triggers").click()
    cy.get("label").contains("Exceptions").click()
  })

  it("should reset cleared dates to today", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch triggerTypes={[]} resolvers={[]} />
      </MockNextRouter>
    )

    const todayStr = format(new Date(), "yyyy-MM-dd")

    cy.get("[data-testid='audit-date-from']").clear()
    cy.get("[data-testid='audit-date-from']").should("have.value", todayStr)

    cy.get("[data-testid='audit-date-to']").clear()
    cy.get("[data-testid='audit-date-to']").should("have.value", todayStr)
  })

  it("should select all resolvers when All option is clicked", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch
          triggerTypes={[]}
          resolvers={[
            { username: "usera", forenames: "First", surname: "User" },
            { username: "userb", forenames: "Second", surname: "Example-User" },
            { username: "userc", forenames: "Third", surname: "Test-User" }
          ]}
        />
      </MockNextRouter>
    )

    cy.get("[data-testid='audit-resolved-by-all']").click()

    cy.get("#audit-search-resolved-by input[type=checkbox]:checked").should("have.length", 4)
  })

  it("should de-selected All checkbox if all resolvers are not selected", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch
          triggerTypes={[]}
          resolvers={[
            { username: "usera", forenames: "First", surname: "User" },
            { username: "userb", forenames: "Second", surname: "Example-User" },
            { username: "userc", forenames: "Third", surname: "Test-User" }
          ]}
        />
      </MockNextRouter>
    )

    cy.get("[data-testid='audit-resolved-by-all']").click()
    cy.get("[data-testid='audit-resolved-by-0']").click()

    cy.get("[data-testid='audit-resolved-by-all']").should("not.be.checked")
  })

  it("should select All checkbox if all resolvers are manually selected", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch
          triggerTypes={[]}
          resolvers={[
            { username: "usera", forenames: "First", surname: "User" },
            { username: "userb", forenames: "Second", surname: "Example-User" },
            { username: "userc", forenames: "Third", surname: "Test-User" }
          ]}
        />
      </MockNextRouter>
    )

    cy.get("[data-testid='audit-resolved-by-0']").click()
    cy.get("[data-testid='audit-resolved-by-1']").click()
    cy.get("[data-testid='audit-resolved-by-2']").click()

    cy.get("[data-testid='audit-resolved-by-all']").should("be.checked")
  })

  it("should de-select all if All is unchecked and all resolvers were selected", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch
          triggerTypes={[]}
          resolvers={[
            { username: "usera", forenames: "First", surname: "User" },
            { username: "userb", forenames: "Second", surname: "Example-User" },
            { username: "userc", forenames: "Third", surname: "Test-User" }
          ]}
        />
      </MockNextRouter>
    )

    cy.get("[data-testid='audit-resolved-by-0']").click()
    cy.get("[data-testid='audit-resolved-by-1']").click()
    cy.get("[data-testid='audit-resolved-by-2']").click()

    cy.get("[data-testid='audit-resolved-by-all']").click()

    cy.get("[data-testid='audit-resolved-by-0']").should("not.be.checked")
    cy.get("[data-testid='audit-resolved-by-1']").should("not.be.checked")
    cy.get("[data-testid='audit-resolved-by-2']").should("not.be.checked")
    cy.get("[data-testid='audit-resolved-by-all']").should("not.be.checked")
  })

  it("should disable submit button with any missing required fields", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch
          triggerTypes={["TRPR0010"]}
          resolvers={[{ username: "usera", forenames: "First", surname: "User" }]}
        />
      </MockNextRouter>
    )

    cy.get("button[name=audit-search-button]").should("not.be.enabled")
  })

  it("should disable submit button if dates are the wrong way around", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch
          triggerTypes={["TRPR0010"]}
          resolvers={[{ username: "usera", forenames: "First", surname: "User" }]}
        />
      </MockNextRouter>
    )

    cy.get("[data-testid='audit-resolved-by-all']").click()
    cy.get("label").contains("Triggers").click()
    cy.get("[data-testid='audit-trigger-type-0']").click()

    cy.get("[data-testid='audit-date-from']").type("2026-02-09")
    cy.get("[data-testid='audit-date-to']").type("2026-02-04")

    cy.get("button[name=audit-search-button]").should("not.be.enabled")
  })

  it("should enable submit button when all required fields are populated", () => {
    cy.mount(
      <MockNextRouter>
        <AuditSearch
          triggerTypes={["TRPR0010"]}
          resolvers={[{ username: "usera", forenames: "First", surname: "User" }]}
        />
      </MockNextRouter>
    )

    cy.get("[data-testid='audit-resolved-by-all']").click()
    cy.get("label").contains("Triggers").click()
    cy.get("[data-testid='audit-trigger-type-0']").click()

    cy.get("button[name=audit-search-button]").should("be.enabled")
  })

  it("should show an error if the api returns a non-success status code", () => {
    const pushSpy = cy.spy().as("routerPush")

    cy.mount(
      <MockNextRouter push={pushSpy}>
        <AuditSearch
          triggerTypes={["TRPR0010"]}
          resolvers={[{ username: "usera", forenames: "First", surname: "User" }]}
        />
      </MockNextRouter>
    )

    cy.get("[data-testid='audit-resolved-by-all']").click()
    cy.get("label").contains("Triggers").click()
    cy.get("[data-testid='audit-trigger-type-0']").click()

    cy.intercept("POST", "/bichard/api/audit", {
      delay: 100,
      statusCode: 400,
      body: JSON.stringify({
        auditId: 4321,
        createdWhen: "2026-03-01",
        createdBy: "exampleUser",
        completedWhen: "2026-04-01",
        fromDate: "2026-01-01",
        toDate: "2026-03-01",
        includedTypes: ["Triggers"],
        triggerTypes: ["TRPR0001"],
        resolvedByUsers: ["user01", "user02"],
        volumeOfCases: 20
      })
    }).as("auditSearch")

    cy.get("button[name=audit-search-button]").click()

    cy.wait("@auditSearch")

    cy.get(".error-message").contains("Failed to create audit")

    cy.get("@routerPush").should("not.be.called")
  })

  it("should show an error if the api returns an invalid response body", () => {
    const pushSpy = cy.spy().as("routerPush")

    cy.mount(
      <MockNextRouter push={pushSpy}>
        <AuditSearch
          triggerTypes={["TRPR0010"]}
          resolvers={[{ username: "usera", forenames: "First", surname: "User" }]}
        />
      </MockNextRouter>
    )

    cy.get("[data-testid='audit-resolved-by-all']").click()
    cy.get("label").contains("Triggers").click()
    cy.get("[data-testid='audit-trigger-type-0']").click()

    cy.intercept("POST", "/bichard/api/audit", {
      delay: 100,
      statusCode: 200,
      body: JSON.stringify({
        unknownField1: true
      })
    }).as("auditSearch")

    cy.get("button[name=audit-search-button]").click()

    cy.wait("@auditSearch")

    cy.get(".error-message").contains("Failed to get audit from server")

    cy.get("@routerPush").should("not.be.called")
  })

  it("should redirect to the audit page when submitting the form", () => {
    const pushSpy = cy.spy().as("routerPush")

    cy.mount(
      <MockNextRouter push={pushSpy}>
        <AuditSearch
          triggerTypes={["TRPR0010"]}
          resolvers={[{ username: "usera", forenames: "First", surname: "User" }]}
        />
      </MockNextRouter>
    )

    cy.get("[data-testid='audit-resolved-by-all']").click()
    cy.get("label").contains("Triggers").click()
    cy.get("[data-testid='audit-trigger-type-0']").click()

    cy.intercept("POST", "/bichard/api/audit", {
      delay: 100,
      statusCode: 200,
      body: JSON.stringify({
        auditId: 4321,
        createdWhen: "2026-03-01",
        createdBy: "exampleUser",
        completedWhen: "2026-04-01",
        fromDate: "2026-01-01",
        toDate: "2026-03-01",
        includedTypes: ["Triggers"],
        triggerTypes: ["TRPR0001"],
        resolvedByUsers: ["user01", "user02"],
        volumeOfCases: 20
      })
    }).as("auditSearch")

    cy.get("button[name=audit-search-button]").click()

    cy.wait("@auditSearch")

    cy.get("@routerPush").should("be.calledWith", "/audit/4321")
  })
})
