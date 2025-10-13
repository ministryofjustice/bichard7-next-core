import endpoints from "./endpoints"

describe("endpoints", () => {
  it("should return ASN query endpoint", () => {
    expect(endpoints.asnQuery).toBe("/find-disposals-by-asn")
  })

  it("should return remand endpoint", () => {
    const endpoint = endpoints.remand("person123", "report123")

    expect(endpoint).toBe("/people/person123/arrest-reports/report123/basic-remands")
  })

  it("should return add disposal endpoint", () => {
    const endpoint = endpoints.addDisposal("person123", "disposal123")

    expect(endpoint).toBe("/people/person123/disposals/disposal123/court-case-disposal-result")
  })

  it("should return subsequent disposal results endpoint", () => {
    const endpoint = endpoints.subsequentDisposalResults("person123", "disposal123")

    expect(endpoint).toBe("/people/person123/disposals/disposal123/court-case-subsequent-disposal-results")
  })
})
