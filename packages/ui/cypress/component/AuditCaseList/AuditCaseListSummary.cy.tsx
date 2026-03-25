import AuditCaseListSummary from "../../../src/features/AuditCaseList/AuditCaseListSummary"
import { AuditDto } from "@moj-bichard7/common/types/Audit"

describe("AuditCaseListSummary", () => {
  const defaultAudit: AuditDto = {
    auditId: 123,
    fromDate: new Date(2025, 2, 10).toISOString(),
    toDate: new Date(2025, 3, 20).toISOString(),
    triggerTypes: ["TRPR0010", "TRPR0011"],
    resolvedByUsers: ["user01", "user02"],
    volumeOfCases: 20,
    completedWhen: null,
    createdBy: "user",
    createdWhen: new Date().toISOString(),
    includedTypes: ["Exceptions", "Triggers"]
  }

  it("should render the correct summary string", () => {
    cy.mount(<AuditCaseListSummary audit={defaultAudit} />)

    cy.get("h2").should(
      "have.text",
      `10 Mar 2025 to 20 Apr 2025: showing 20% of cases from 2 users with 2 Triggers and Exceptions`
    )
  })

  it("should show the correct from and to date", () => {
    cy.mount(<AuditCaseListSummary audit={defaultAudit} />)

    cy.contains("10 Mar 2025 to 20 Apr 2025")
  })

  it("should include the volume percentage amount", () => {
    const audit: AuditDto = {
      ...defaultAudit,
      volumeOfCases: 50
    }

    cy.mount(<AuditCaseListSummary audit={audit} />)

    cy.contains("showing 50% of cases")
  })

  it("should show the user count for 1 user", () => {
    const audit: AuditDto = {
      ...defaultAudit,
      resolvedByUsers: ["user01"]
    }

    cy.mount(<AuditCaseListSummary audit={audit} />)

    cy.contains("from 1 user ")
  })

  it("should show the user count for 2 users", () => {
    const audit: AuditDto = {
      ...defaultAudit,
      resolvedByUsers: ["user01", "user02"]
    }

    cy.mount(<AuditCaseListSummary audit={audit} />)

    cy.contains("from 2 users ")
  })

  it("should include trigger count ==1 if triggers are included", () => {
    const audit: AuditDto = {
      ...defaultAudit,
      triggerTypes: ["TRPR0010"],
      includedTypes: ["Exceptions", "Triggers"]
    }

    cy.mount(<AuditCaseListSummary audit={audit} />)

    cy.contains("with 1 Trigger and Exceptions")
  })

  it("should include trigger count >1 if triggers are included", () => {
    const audit: AuditDto = {
      ...defaultAudit,
      triggerTypes: ["TRPR0010", "TRPR0011"],
      includedTypes: ["Exceptions", "Triggers"]
    }

    cy.mount(<AuditCaseListSummary audit={audit} />)

    cy.contains("with 2 Triggers and Exceptions")
  })

  it("should include trigger count only if Exceptions are not included", () => {
    const audit: AuditDto = {
      ...defaultAudit,
      triggerTypes: ["TRPR0010", "TRPR0011"],
      includedTypes: ["Triggers"]
    }

    cy.mount(<AuditCaseListSummary audit={audit} />)

    cy.contains("with 2 Triggers")
  })

  it("should include Exceptions if only exceptions are included", () => {
    const audit: AuditDto = {
      ...defaultAudit,
      triggerTypes: [],
      includedTypes: ["Exceptions"]
    }

    cy.mount(<AuditCaseListSummary audit={audit} />)

    cy.contains("with Exceptions")
  })
})
