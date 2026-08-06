import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { convertOrganisationUnits } from "./convertOrganisationUnits"

describe("convertOrganisationUnits", () => {
  it("should return an empty array when given an empty array", () => {
    const result = convertOrganisationUnits([])
    expect(result).toEqual([])
  })

  it("should format organisation units into combined codes and names", () => {
    const mockOrganisationUnits: OrganisationUnit[] = [
      {
        topLevelCode: "C",
        topLevelName: "Magistrates Courts",
        secondLevelCode: "00",
        secondLevelName: "London",
        thirdLevelCode: "01",
        thirdLevelName: "Westminster",
        thirdLevelPsaCode: "1234",
        bottomLevelCode: "00",
        bottomLevelName: "Court 1"
      },
      {
        topLevelCode: "B",
        topLevelName: "Crown Court",
        secondLevelCode: "02",
        secondLevelName: "",
        thirdLevelCode: "03",
        thirdLevelName: "Snaresbrook",
        thirdLevelPsaCode: "5678",
        bottomLevelCode: "01"
      }
    ]

    const result = convertOrganisationUnits(mockOrganisationUnits)

    expect(result).toEqual([
      {
        fullOrganisationCode: "B020301",
        fullOrganisationName: "Crown Court Snaresbrook"
      },
      {
        fullOrganisationCode: "C000100",
        fullOrganisationName: "Magistrates Courts London Westminster Court 1"
      }
    ])
  })
})
