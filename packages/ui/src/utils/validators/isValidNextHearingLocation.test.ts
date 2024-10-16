import isValidNextHearingLocation from "./isValidNextHearingLocation"

describe("isValidNextHearingLocation", () => {
  const organisations = [
    {
      fullOrganisationCode: "B21XA00",
      fullOrganisationName: "Magistrates' Courts Staffordshire AIT Stoke-on-Trent"
    },
    {
      fullOrganisationCode: "B63AD00",
      fullOrganisationName: "Magistrates' Courts Dyfed-Powys Aberystwyth"
    },
    {
      fullOrganisationCode: "B44AG00",
      fullOrganisationName: "Magistrates' Courts Hampshire Aldershot"
    },
    {
      fullOrganisationCode: "B43AJ00",
      fullOrganisationName: "Magistrates' Courts Thames Valley Amersham"
    },
    {
      fullOrganisationCode: "C43AM00",
      fullOrganisationName: "Crown Courts Thames Valley Amersham"
    }
  ]

  it("Should return true when the input is valid", () => {
    const validNextHearingLocation = isValidNextHearingLocation("B63AD00", organisations)
    expect(validNextHearingLocation).toBe(true)
  })

  it("Should return false when the input is invalid", () => {
    const validNextHearingLocation = isValidNextHearingLocation("B21XA01", organisations)
    expect(validNextHearingLocation).toBe(false)
  })

  it("Should return false when the input is left empty", () => {
    const validNextHearingLocation = isValidNextHearingLocation("", [])
    expect(validNextHearingLocation).toBe(false)
  })

  it("Should return false when the input is whitespace", () => {
    const validNextHearingLocation = isValidNextHearingLocation("        ", [])
    expect(validNextHearingLocation).toBe(false)
  })
})
