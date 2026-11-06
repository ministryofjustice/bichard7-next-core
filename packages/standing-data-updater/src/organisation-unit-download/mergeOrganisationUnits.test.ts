import type { OrganisationUnit } from "../types/OrganisationUnit"
import mergeOrganisationUnits from "./mergeOrganisationUnits"

describe("MergeOrganisationUnits", () => {
  it("Merges the downloaded organisation units with the existing data", () => {
    const newData: OrganisationUnit[] = [
      {
        topLevelCode: "N",
        secondLevelCode: "1",
        thirdLevelCode: "AA",
        bottomLevelCode: "00",
        topLevelName: "new topLevelName",
        secondLevelName: "new secondLevelName",
        thirdLevelName: "new thirdLevelName",
        bottomLevelName: "new bottomLevelName",
        thirdLevelPsaCode: "new thirdLevelPsaCode"
      },
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "AA",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts(changed)",
        secondLevelName: "South Wales(changed)",
        thirdLevelName: "Aberdare(changed)",
        bottomLevelName: undefined,
        thirdLevelPsaCode: "123456"
      }
    ]
    const oldData: OrganisationUnit[] = [
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "AA",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare",
        bottomLevelName: undefined,
        thirdLevelPsaCode: "123456"
      },
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "WL",
        bottomLevelCode: "00",
        topLevelName: "Old data",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare (County Court, Cwmbach Road)",
        bottomLevelName: undefined,
        thirdLevelPsaCode: "54323"
      }
    ]

    const expectedData: OrganisationUnit[] = [
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "AA",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts(changed)",
        secondLevelName: "South Wales(changed)",
        thirdLevelName: "Aberdare(changed)",
        bottomLevelName: undefined,
        thirdLevelPsaCode: "123456"
      },
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "WL",
        bottomLevelCode: "00",
        topLevelName: "Old data",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare (County Court, Cwmbach Road)",
        bottomLevelName: undefined,
        thirdLevelPsaCode: "54323"
      },
      {
        topLevelCode: "N",
        secondLevelCode: "1",
        thirdLevelCode: "AA",
        bottomLevelCode: "00",
        topLevelName: "new topLevelName",
        secondLevelName: "new secondLevelName",
        thirdLevelName: "new thirdLevelName",
        bottomLevelName: "new bottomLevelName",
        thirdLevelPsaCode: "new thirdLevelPsaCode"
      }
    ]

    const result = mergeOrganisationUnits(newData, oldData)
    expect(result).toEqual(expectedData)
  })
})
