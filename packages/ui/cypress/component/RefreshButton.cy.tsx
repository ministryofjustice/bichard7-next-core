import { RefreshButton } from "../../src/components/Buttons/RefreshButton"

describe("RefreshButton", () => {
  it("changes text relative of time", () => {
    cy.clock(new Date())

    cy.mount(<RefreshButton location={"top"} />)

    cy.contains("Last updated less than a minute ago")

    cy.tick(1000 * 60 * 5)

    cy.contains("Last updated 5 minutes ago")

    cy.clock().invoke("restore")
  })
})
