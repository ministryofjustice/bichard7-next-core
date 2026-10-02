import isAsnFormatValid from "./isAsnFormatValid"

describe("isAsnFormatValid", () => {
  it("should return true when ASN is valid", () => {
    const result = isAsnFormatValid("1101ZD0100000410836V")
    expect(result).toBe(true)
  })

  it("should return true when ASN has slashes and is valid", () => {
    const result = isAsnFormatValid("11/01ZD/01/00000410836V")
    expect(result).toBe(true)
  })

  it("should return false when ASN has invalid check letter", () => {
    const result = isAsnFormatValid("1101ZD0100000448754J")
    expect(result).toBe(false)
  })

  it("should return true when ASN has valid check letter", () => {
    const result = isAsnFormatValid("1101ZD0100000448754K")
    expect(result).toBe(true)
  })

  it("Should return true when shortform ASN is valid", () => {
    const result = isAsnFormatValid("1101ZD01410836V")
    expect(result).toBe(true)
  })

  it("Should return false when shortform ASN is invalid", () => {
    const result = isAsnFormatValid("1101ZD01410811A")
    expect(result).toBe(false)
  })
})
