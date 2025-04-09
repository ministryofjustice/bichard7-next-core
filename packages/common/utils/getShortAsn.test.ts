import getShortAsn from "./getShortAsn"

describe("getShortAsn", () => {
  it("Should return the short version of the ASN", () => {
    const result = getShortAsn("1101ZD0100000448754K")
    expect(result).toBe("11/01ZD/01/448754K")
  })

  it("Should return empty string when ASN is null", () => {
    const result = getShortAsn(null)
    expect(result).toBe("")
  })

  it("Should return empty string when ASN is undefined", () => {
    const result = getShortAsn(undefined)
    expect(result).toBe("")
  })

  it("Should handle ASNs with forward slashes", () => {
    const result = getShortAsn("11/01ZD/01/448754K")
    expect(result).toBe("11/01ZD/01/448754K")
  })

  it("Should handle ASNs with leading zeros in the sequence", () => {
    const result = getShortAsn("1101ZD0100000000001A")
    expect(result).toBe("11/01ZD/01/1A")
  })
})
