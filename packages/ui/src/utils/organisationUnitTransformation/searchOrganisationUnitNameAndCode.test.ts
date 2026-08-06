import type OrganisationUnitNameAndCode from "@/types/OrganisationUnitNameAndCode"
import { searchOrganisationUnits } from "./searchOrganisationUnitNameAndCode"

describe("searchOrganisationUnitNameAndCode", () => {
  const mockUnits: OrganisationUnitNameAndCode[] = [
    {
      fullOrganisationCode: "B01EF00",
      fullOrganisationName: "Metropolitan Police Service"
    },
    {
      fullOrganisationCode: "C02AB00",
      fullOrganisationName: "Greater Manchester Police"
    },
    {
      fullOrganisationCode: "D03CD00",
      fullOrganisationName: "West Midlands Police"
    }
  ]

  it("should return all organisation units when keyword is an empty string", () => {
    const result = searchOrganisationUnits("", mockUnits)

    expect(result).toEqual(mockUnits)
    expect(result).toHaveLength(3)
  })

  it("should filter by organisation name in a case-insensitive manner", () => {
    const result = searchOrganisationUnits("manchester", mockUnits)

    expect(result).toEqual([
      {
        fullOrganisationCode: "C02AB00",
        fullOrganisationName: "Greater Manchester Police"
      }
    ])
  })

  it("should filter by full organisation code in a case-insensitive manner", () => {
    const result = searchOrganisationUnits("b01ef", mockUnits)

    expect(result).toEqual([
      {
        fullOrganisationCode: "B01EF00",
        fullOrganisationName: "Metropolitan Police Service"
      }
    ])
  })

  it("should extract and match using the REGEX capture group", () => {
    const result = searchOrganisationUnits("b01ef00", mockUnits)

    expect(result).toEqual([
      {
        fullOrganisationCode: "B01EF00",
        fullOrganisationName: "Metropolitan Police Service"
      }
    ])
  })

  it("should match regex pattern even with surrounding text or extra digits", () => {
    const result = searchOrganisationUnits("Test c02ab99 test filler non-matching 123", mockUnits)

    expect(result).toEqual([
      {
        fullOrganisationCode: "C02AB00",
        fullOrganisationName: "Greater Manchester Police"
      }
    ])
  })

  it("should return an empty array when no matches are found", () => {
    const result = searchOrganisationUnits("NonExistentKeyword", mockUnits)

    expect(result).toEqual([])
  })

  it("should return an empty array when searching an empty array of units", () => {
    const result = searchOrganisationUnits("test", [])

    expect(result).toEqual([])
  })
})
