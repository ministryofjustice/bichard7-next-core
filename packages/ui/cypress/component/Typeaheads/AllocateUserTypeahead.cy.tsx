import React from "react"
import AllocateUserTypeahead from "@/components/Typeaheads/AllocateUserTypeahead"

describe("AllocateUserTypeahead Component", () => {
  const mockUsers = [
    { id: 1, fullname: "Jane Doe" },
    { id: 2, fullname: "John Smith" }
  ]

  beforeEach(() => {
    cy.intercept("GET", "/bichard/api/court-cases/allocation/users*", (req) => {
      const search = req.url.includes("usernameOrName=John")

      req.reply({
        statusCode: 200,
        body: search ? [mockUsers[1]] : mockUsers
      })
    }).as("fetchUsers")
  })

  it("renders the input field", () => {
    cy.mount(<AllocateUserTypeahead onSelect={cy.stub()} />)

    cy.get("input#allocate-user").should("be.visible").and("have.attr", "placeholder", "Type a name to allocate...")
  })

  it("fetches and displays users on typing", () => {
    cy.mount(<AllocateUserTypeahead onSelect={cy.stub()}></AllocateUserTypeahead>)

    cy.wait("@fetchUsers")

    cy.get("input#allocate-user").type("Jane")

    cy.wait("@fetchUsers")

    cy.get("ul").children("li").should("have.length.at.least", 1)
    cy.contains("li", "Jane Doe").should("be.visible")
  })

  it("calls onSelect when a user is clicked", () => {
    const onSelectStub = cy.stub().as("onSelect")
    cy.mount(<AllocateUserTypeahead onSelect={onSelectStub} />)

    cy.get("input#allocate-user").type("John")
    cy.wait("@fetchUsers")

    cy.contains("li", "John Smith").click()

    cy.get("@onSelect").should("have.been.calledWith", mockUsers[1])
  })

  it("calls onSelect with null if input is cleared", () => {
    const onSelectStub = cy.stub().as("onSelect")
    cy.mount(<AllocateUserTypeahead onSelect={onSelectStub} />)

    cy.get("input#allocate-user").as("typeaheadInput")

    cy.get("@typeaheadInput").type("Jane")
    cy.get("@typeaheadInput").clear()

    cy.get("@onSelect").should("have.been.calledWith", null)
  })
})
