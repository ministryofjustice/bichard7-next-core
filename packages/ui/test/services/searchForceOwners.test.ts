import type { Force } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import searchForceOwners, { getForceCode, getForceName, getForceOwnerCodeAndName } from "services/searchForceOwners"

describe("searchForceOwners", () => {
  const sampleForce = { code: "01", name: "Metropolitan Police" } as Force

  it("getForceCode returns the force code as a string", () => {
    expect(getForceCode(sampleForce)).toBe("01")
  })

  it("getForceName returns the force name", () => {
    expect(getForceName(sampleForce)).toBe("Metropolitan Police")
  })

  it("getForceOwnerCodeAndName combines code and name with a space", () => {
    expect(getForceOwnerCodeAndName(sampleForce)).toBe("01 Metropolitan Police")
  })

  describe("searchForceOwners default function", () => {
    it("returns an empty array if currentForceOwner is empty", () => {
      const result = searchForceOwners("", "Police")
      expect(result).toEqual([])
    })

    it("returns an empty array if keyword is empty", () => {
      const result = searchForceOwners("01", "")
      expect(result).toEqual([])
    })

    it("returns items that match the force code", () => {
      const result = searchForceOwners("01", "02")

      expect(result).toHaveLength(1)
      expect(result[0].code).toBe("02")
      expect(result[0].name).toContain("Metropolitan Police Service")
    })

    it("returns items that match the force name (case insensitive)", () => {
      const result = searchForceOwners("01", "metropolitan police service")

      expect(result).toHaveLength(1)
      expect(result[0].code).toBe("02")
    })

    it("sorts the results by force code", () => {
      const result = searchForceOwners("03", "Police")

      const codes = result.map((force) => force.code)
      const sortedCodes = [...codes].sort()

      expect(codes).toEqual(sortedCodes)
    })

    it("handles the hyphen replacement logic for formatting", () => {
      const result = searchForceOwners("01", "37 - Suffolk")

      expect(result).toHaveLength(1)
      expect(result[0].code).toBe("37")
    })

    it("returns an empty array if no matches are found", () => {
      const result = searchForceOwners("01", "NotARealForceXYZ")
      expect(result).toEqual([])
    })
  })
})
