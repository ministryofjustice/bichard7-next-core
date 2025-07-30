import { LinkButton } from "../../../src/components/Buttons/LinkButton"
import * as NextRouter from "next/router"

describe("LinkButton", () => {
  const basePath = "/base"
  const asPath = "/current"

  beforeEach(() => {
    cy.stub(NextRouter, "useRouter").returns({
      basePath,
      asPath
    })
  })

  it("mounts", () => {
    cy.mount(<LinkButton href="page">{"Text"}</LinkButton>)
  })

  it("renders text", () => {
    cy.mount(<LinkButton href="page">{"Text"}</LinkButton>)
    cy.get("a").should("have.text", "Text")
  })

  it("shows link with /", () => {
    cy.mount(<LinkButton href="/page">{"Text"}</LinkButton>)
    cy.get("a").should("have.attr", "href").and("include", "/page")
  })

  it("shows link without /", () => {
    cy.mount(<LinkButton href="page">{"Text"}</LinkButton>)
    cy.get("a").should("have.attr", "href").and("include", `${basePath}${asPath}/page`)
  })

  it("merges class names", () => {
    cy.mount(
      <LinkButton className="extra-class" href="page">
        {"Text"}
      </LinkButton>
    )
    cy.get("a").should("have.class", "govuk-button").should("have.class", "extra-class")
  })

  it("adds secondary class", () => {
    cy.mount(
      <LinkButton href="page" secondary>
        {"Text"}
      </LinkButton>
    )
    cy.get("a").should("have.class", "govuk-button").should("have.class", "govuk-button--secondary")
  })
})
