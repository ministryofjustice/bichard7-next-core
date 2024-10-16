import OrganisationUnitApiResponse from "../../../../src/types/OrganisationUnitApiResponse"

describe("Organisation Units API endpoint", () => {
  beforeEach(() => {
    cy.loginAs("GeneralHandler")
  })

  it("returns a list of organisations that matches the search keyword", () => {
    const searchKeyword = "croydon"
    cy.request({
      method: "GET",
      url: `/bichard/api/organisation-units?search=${searchKeyword}`
    }).then((response) => {
      expect(response.status).to.eq(200)

      const organisationUnitsResponse = response.body as OrganisationUnitApiResponse
      expect(organisationUnitsResponse).to.have.length(3)
      expect(organisationUnitsResponse[0].fullOrganisationName).to.equal("Crown Courts London Croydon")
      expect(organisationUnitsResponse[1].fullOrganisationName).to.equal("Magistrates' Courts London Croydon")
      expect(organisationUnitsResponse[2].fullOrganisationName).to.equal("Crown Courts London Jury's Inn Croydon")
    })
  })

  it("returns one item in a list for when search keyword is an exact match", () => {
    const searchKeyword = "B01EF00"
    cy.request({
      method: "GET",
      url: `/bichard/api/organisation-units?search=${searchKeyword}`
    }).then((response) => {
      expect(response.status).to.eq(200)

      const organisationUnitsResponse = response.body as OrganisationUnitApiResponse
      expect(organisationUnitsResponse).to.have.length(1)
      expect(organisationUnitsResponse[0].fullOrganisationName).to.equal("Magistrates' Courts London Croydon")
    })
  })
})
