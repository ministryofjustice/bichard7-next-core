import type { OrganisationUnit } from "../types/OrganisationUnit"
import { backFillThirdLevelPsaCode } from "./backFillThirdLevelPsaCode"

describe("BackfillThirdLevelPsaCode", () => {
  it("backfills the third level PSA code from the existing data when codes are matching", () => {
    const firstExpectedPsaCode = "123456"
    const secondExpectedPsaCode = "54323"

    const newData: OrganisationUnit[] = [
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "AA",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare",
        bottomLevelName: undefined,
        thirdLevelPsaCode: ""
      },
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "WL",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare (County Court, Cwmbach Road)",
        bottomLevelName: undefined,
        thirdLevelPsaCode: ""
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
        thirdLevelPsaCode: firstExpectedPsaCode
      },
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "WL",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare (County Court, Cwmbach Road)",
        bottomLevelName: undefined,
        thirdLevelPsaCode: secondExpectedPsaCode
      },
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "AB",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare Youth Court",
        bottomLevelName: undefined,
        thirdLevelPsaCode: ""
      }
    ]

    const result = backFillThirdLevelPsaCode(newData, oldData)
    expect(result[0].thirdLevelPsaCode).toEqual(firstExpectedPsaCode)
    expect(result[1].thirdLevelPsaCode).toEqual(secondExpectedPsaCode)
  })

  it("throws an error when no matches found in the existing record", () => {
    const newData: OrganisationUnit[] = [
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "AAAAAAA",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare",
        bottomLevelName: undefined,
        thirdLevelPsaCode: ""
      }
    ]
    const oldData: OrganisationUnit[] = []

    expect(() => backFillThirdLevelPsaCode(newData, oldData)).toThrow()
  })
})
