import React from "react"
import ForceOwnerTypeahead from "components/Typeaheads/ForceOwnerTypeahead"
import type ForceOwnerApiResponse from "types/ForceOwnerApiResponse"

const mockForces: ForceOwnerApiResponse = [
  { forceCode: "01", forceName: "Metropolitan Police" },
  { forceCode: "02", forceName: "Suffolk Constabulary" },
  { forceCode: "03", forceName: "Cumbria Constabulary" }
]

describe("ForceOwnerTypeahead Component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/bichard/api/force-owner*", (req) => {
      const url = new URL(req.url)
      const searchTerm = url.searchParams.get("search")?.toLowerCase() || ""

      const filtered = mockForces.filter(
        (force) => force.forceCode.includes(searchTerm) || force.forceName.toLowerCase().includes(searchTerm)
      )

      req.reply({
        statusCode: 200,
        body: filtered
      })
    }).as("getForces")
  })

  it("renders the input field correctly", () => {
    const onSelectSpy = cy.spy().as("onSelectSpy")
    cy.mount(<ForceOwnerTypeahead onSelect={onSelectSpy} />)
    cy.get("input#force").should("exist").and("have.class", "govuk-input")
  })

  it("searches and displays ONLY matching results", () => {
    const onSelectSpy = cy.spy().as("onSelectSpy")
    cy.mount(<ForceOwnerTypeahead onSelect={onSelectSpy} />)

    cy.get("input#force").type("Police")

    cy.wait("@getForces")

    cy.get("ul li").should("have.length", 1)
    cy.get("ul li").first().should("contain.text", "01 - Metropolitan Police")
  })

  it("updates parent component when an item is clicked", () => {
    const onSelectSpy = cy.spy().as("onSelectSpy")
    cy.mount(<ForceOwnerTypeahead onSelect={onSelectSpy} />)

    cy.get("input#force").type("Suffolk")
    cy.wait("@getForces")

    cy.contains("li", "02 - Suffolk Constabulary").click()

    cy.get("@onSelectSpy").should("have.been.calledWith", mockForces[1])
    cy.get("input#force").should("have.value", "02 - Suffolk Constabulary")
  })

  it("updates parent component when input is blurred", () => {
    const onSelectSpy = cy.spy().as("onSelectSpy")
    cy.mount(<ForceOwnerTypeahead onSelect={onSelectSpy} />)

    cy.get("input#force").type("Suffolk")
    cy.wait("@getForces")
    cy.get("input#force").blur()

    cy.get("@onSelectSpy").should("have.been.calledWith", mockForces[1])
    cy.get("input#force").should("have.value", "02 - Suffolk Constabulary")
  })

  it("selects the top result automatically when pressing Enter", () => {
    const onSelectSpy = cy.spy().as("onSelectSpy")
    cy.mount(<ForceOwnerTypeahead onSelect={onSelectSpy} />)

    cy.get("input#force").type("03")

    cy.wait("@getForces")

    cy.get("ul li").should("have.length", 1)
    cy.get("ul li").first().should("contain.text", "03 - Cumbria Constabulary")

    cy.get("input#force").type("{enter}")

    cy.get("@onSelectSpy").should("have.been.calledWith", mockForces[2])

    cy.get("input#force").should("have.value", "03 - Cumbria Constabulary")
  })

  it("filters out the currentForceOwner from the results", () => {
    const onSelectSpy = cy.spy().as("onSelectSpy")

    cy.mount(<ForceOwnerTypeahead onSelect={onSelectSpy} currentForceOwner="01" />)

    cy.get("input#force").type("Police")
    cy.wait("@getForces")

    cy.get("ul li").should("have.length", 0)
  })

  it("clears the selection in parent when input is cleared", () => {
    const onSelectSpy = cy.spy().as("onSelectSpy")
    cy.mount(<ForceOwnerTypeahead onSelect={onSelectSpy} />)

    cy.get("input#force").type("03")
    cy.wait("@getForces")
    cy.get("ul li").should("be.visible") // Guard: Wait for list
    cy.get("input#force").type("{enter}")

    cy.get("input#force").should("have.value", "03 - Cumbria Constabulary")
    cy.get("@onSelectSpy").should("have.been.calledWith", mockForces[2])

    cy.get("input#force").clear()

    cy.get("@onSelectSpy").its("lastCall.args").should("deep.equal", [null])
  })
})
