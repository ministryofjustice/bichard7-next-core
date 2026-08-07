import OrganisationUnits from "@moj-bichard7-developers/bichard7-next-data/data/organisation-unit.json"

import searchCourtOrganisationUnits, {
  getFullOrganisationName,
  getOrganisationCodeAndName,
  sortCourtOrganisationUnits
} from "./searchCourtOrganisationUnits"

describe("searchCourtOrganisationUnits", () => {
  const sortedOrganisationUnits = sortCourtOrganisationUnits(OrganisationUnits)

  it("Should return an array with all organisation units when search keyword is an empty string", () => {
    expect(searchCourtOrganisationUnits("", sortedOrganisationUnits)).toHaveLength(sortedOrganisationUnits.length)
  })

  it("Should return one organisation unit when there is an exact match", () => {
    const result = searchCourtOrganisationUnits("B01EF00", sortedOrganisationUnits)
    expect(result).toHaveLength(1)

    expect(getOrganisationCodeAndName(result[0])).toBe("B01EF00 Magistrates' Courts London Croydon")
  })

  it("Should not include police organisations", () => {
    const metropolitanPoliceOrgCode = "010000"
    expect(searchCourtOrganisationUnits(metropolitanPoliceOrgCode, sortedOrganisationUnits)).toHaveLength(0)
  })

  it("Should return many organisation units when there is a partial match of org code", () => {
    expect(searchCourtOrganisationUnits("B01", sortedOrganisationUnits)).toHaveLength(34)
    expect(searchCourtOrganisationUnits("B01C", sortedOrganisationUnits)).toHaveLength(3)
    expect(searchCourtOrganisationUnits("B01CA", sortedOrganisationUnits)).toHaveLength(0)
    expect(searchCourtOrganisationUnits("B01DU", sortedOrganisationUnits)).toHaveLength(1)
  })

  it("Should return many organisation units when there is a partial match of org name", () => {
    const result = searchCourtOrganisationUnits("Croydon", sortedOrganisationUnits)
    expect(result).toHaveLength(3)

    expect(getOrganisationCodeAndName(result[0])).toBe("C01CY00 Crown Courts London Croydon")
    expect(getOrganisationCodeAndName(result[1])).toBe("B01EF00 Magistrates' Courts London Croydon")
    expect(getOrganisationCodeAndName(result[2])).toBe("C01JI00 Crown Courts London Jury's Inn Croydon")
  })

  it("Should return 'Magistrates Courts Greater Manchester Wigan'", () => {
    const result = searchCourtOrganisationUnits("B06OJ08", sortedOrganisationUnits)

    expect(result).toHaveLength(1)

    expect(getFullOrganisationName(result[0])).toBe("Magistrates' Courts Greater Manchester Wigan")
  })
})
