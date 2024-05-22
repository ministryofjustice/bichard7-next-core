import isFailedToAppearWarrantIssued from "./isFailedToAppearWarrantIssued"

describe("isFailedToAppearWarrentIssued", () => {
  it("returns true if result code associated with warrant being issued and qualifiers do not indicate defendant failed to appear", () => {
    expect(isFailedToAppearWarrantIssued(4575, [])).toBeTruthy()
    expect(isFailedToAppearWarrantIssued(4576, [])).toBeTruthy()
    expect(isFailedToAppearWarrantIssued(4577, [])).toBeTruthy()
    expect(isFailedToAppearWarrantIssued(4585, [])).toBeTruthy()
    expect(isFailedToAppearWarrantIssued(4586, [])).toBeTruthy()
  })

  it("returns false if result code associated with warrant being issued and qualifiers indicate defendant failed to appear", () => {
    expect(isFailedToAppearWarrantIssued(4575, ["EO"])).toBeFalsy()
    expect(isFailedToAppearWarrantIssued(4576, ["EO"])).toBeFalsy()
    expect(isFailedToAppearWarrantIssued(4577, ["EO"])).toBeFalsy()
    expect(isFailedToAppearWarrantIssued(4585, ["EO"])).toBeFalsy()
    expect(isFailedToAppearWarrantIssued(4586, ["EO"])).toBeFalsy()
  })

  it("returns false if result code not associated with warrent being issued", () => {
    expect(isFailedToAppearWarrantIssued(9999, [])).toBeFalsy()
  })
})
