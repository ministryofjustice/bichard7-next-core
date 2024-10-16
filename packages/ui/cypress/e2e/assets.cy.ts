import { loginAndVisit } from "../support/helpers"

describe("GOV.UK Assets", () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.task("clearCourtCases")

    loginAndVisit()
  })

  it("Should provide copyright logo", () => {
    cy.get(
      "a[href='https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/']"
    )
      .should("be.visible")
      .should("have.attr", "image", "[object Object]")
  })

  it("Should provide favicon icon that loads correctly", () => {
    cy.get("link[rel='shortcut icon']")
      .should("have.attr", "href")
      .then((iconHref) => {
        const iconUrl = iconHref as unknown as string
        cy.request({
          url: iconUrl,
          failOnStatusCode: false
        }).then((resp) => {
          expect(resp.status).not.to.equal(404)
          expect(resp.status).to.equal(200)
          expect(resp.body).not.to.equal(undefined)
        })
      })
  })
})

export {}
