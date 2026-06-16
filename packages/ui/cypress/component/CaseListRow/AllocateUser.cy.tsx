import React from "react"
import { AllocateUser, ColumnType } from "@/features/CourtCaseList/tags/Allocate/AllocateUser"

describe("AllocateUser Component", () => {
  const mockCaseId = 123
  const mockColumnType = "Trigger" as ColumnType

  const mockUsers = [{ id: 99, fullname: "Jane Doe" }]

  beforeEach(() => {
    cy.intercept("GET", "/bichard/api/court-cases/allocation/users*", {
      statusCode: 200,
      body: mockUsers
    }).as("fetchUsers")

    cy.intercept("PUT", `/bichard/api/court-cases/${mockCaseId}/allocate?caseType=${mockColumnType}`, {
      statusCode: 200,
      body: { success: true }
    }).as("allocateRequest")
  })

  it("displays exception button", () => {
    cy.mount(<AllocateUser columnType={"exceptions"} caseId={mockCaseId} />)

    cy.contains("button", "Allocate exceptions").click()
  })

  it("displays triggers button", () => {
    cy.mount(<AllocateUser columnType={"triggers"} caseId={mockCaseId} />)

    cy.contains("button", "Allocate triggers").click()
  })

  it("allocates a user and displays a success message via autosave", () => {
    cy.mount(<AllocateUser columnType={mockColumnType} caseId={mockCaseId} />)

    cy.contains("button", "Allocate Trigger").click()
    cy.wait("@fetchUsers")

    cy.get("input#allocate-user").type("Jane")
    cy.contains("li", "Jane Doe").click()

    cy.wait("@allocateRequest").then((interception) => {
      expect(interception.request.body).to.deep.equal({
        id: 99,
        fullname: "Jane Doe"
      })
    })

    cy.contains("Input saved").should("be.visible")
  })

  it("handles API errors gracefully via AutoSaveBase", () => {
    cy.intercept("PUT", `/bichard/api/court-cases/${mockCaseId}/allocate?caseType=${mockColumnType}`, {
      statusCode: 500
    }).as("allocateRequestError")

    cy.mount(<AllocateUser columnType={mockColumnType} caseId={mockCaseId} />)

    cy.contains("button", "Allocate Trigger").click()
    cy.wait("@fetchUsers")

    cy.get("input#allocate-user").type("Jane")
    cy.contains("li", "Jane Doe").click()

    cy.wait("@allocateRequestError")

    cy.contains("Autosave has failed, please refresh").should("be.visible")
  })
})
