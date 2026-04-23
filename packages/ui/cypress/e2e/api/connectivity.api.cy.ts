describe("GET /connectivity", () => {
  it("returns a 200", () => {
    cy.request({
      method: "GET",
      url: "/bichard/api/connectivity",
      headers: { "x-connectivity-check-key": "test-connectivity-key" }
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equal({ database: true })
    })
  })

  it("returns a 401 if no API key", () => {
    cy.request({
      method: "GET",
      url: "/bichard/api/connectivity",
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(401)
    })
  })
})
