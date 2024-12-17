import isFailedToAppearWarrantIssued from "./isFailedToAppearWarrantIssued"

describe("isFailedToAppearWarrantIssued", () => {
  it("returns true if result code associated with warrant being issued", () => {
    expect(isFailedToAppearWarrantIssued(4575)).toBeTruthy()
    expect(isFailedToAppearWarrantIssued(4576)).toBeTruthy()
    expect(isFailedToAppearWarrantIssued(4577)).toBeTruthy()
    expect(isFailedToAppearWarrantIssued(4585)).toBeTruthy()
    expect(isFailedToAppearWarrantIssued(4586)).toBeTruthy()
  })

  it("returns false if result code not associated with warrant being issued", () => {
    expect(isFailedToAppearWarrantIssued(9999)).toBeFalsy()
  })
})
