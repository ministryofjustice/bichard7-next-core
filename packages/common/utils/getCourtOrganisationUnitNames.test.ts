import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

import { getFullOrganisationCode, getFullOrganisationName } from "./getCourtOrganisationUnitNames"

describe("OrganisationUnit Utils", () => {
  const baseOrgUnit: OrganisationUnit = {
    bottomLevelCode: "04",
    bottomLevelName: "Bottom Level",
    secondLevelCode: "02",
    secondLevelName: "Second Level",
    thirdLevelCode: "03",
    thirdLevelName: "Third Level",
    thirdLevelPsaCode: "PSA123",
    topLevelCode: "01",
    topLevelName: "Top Level"
  }

  describe("getFullOrganisationCode", () => {
    it("should concatenate all four level codes into a single string", () => {
      const result = getFullOrganisationCode(baseOrgUnit)
      expect(result).toBe("01020304")
    })

    it("should handle empty code strings correctly", () => {
      const orgUnit: OrganisationUnit = {
        ...baseOrgUnit,
        bottomLevelCode: "",
        thirdLevelCode: ""
      }

      const result = getFullOrganisationCode(orgUnit)
      expect(result).toBe("0102")
    })
  })

  describe("getFullOrganisationName", () => {
    it("should join all name levels with spaces when all are populated", () => {
      const result = getFullOrganisationName(baseOrgUnit)
      expect(result).toBe("Top Level Second Level Third Level Bottom Level")
    })

    it("should filter out undefined/empty string name parts without extra spaces", () => {
      const orgUnit: OrganisationUnit = {
        ...baseOrgUnit,
        bottomLevelName: "Bottom Level",
        secondLevelName: "",
        thirdLevelName: undefined
      }

      const result = getFullOrganisationName(orgUnit)
      expect(result).toBe("Top Level Bottom Level")
    })

    it("should return an empty string if all name fields are empty strings", () => {
      const orgUnit: OrganisationUnit = {
        ...baseOrgUnit,
        bottomLevelName: "",
        secondLevelName: "",
        thirdLevelName: "",
        topLevelName: ""
      }

      const result = getFullOrganisationName(orgUnit)
      expect(result).toBe("")
    })
  })
})
