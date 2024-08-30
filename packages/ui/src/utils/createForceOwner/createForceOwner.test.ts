import { OrganisationUnitCodes } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import createForceOwner from "./createForceOwner"

describe("createForceOwner", () => {
  it("Should parse a 2-character long org", () => {
    const forceOwner = createForceOwner("12")
    const expectedForceOwner: OrganisationUnitCodes = {
      SecondLevelCode: "12",
      ThirdLevelCode: "00",
      BottomLevelCode: "00",
      OrganisationUnitCode: "120000"
    }
    expect(forceOwner).toStrictEqual(expectedForceOwner)
  })

  it("Should parse a 3-character long org", () => {
    const forceOwner = createForceOwner("123")
    const expectedForceOwner: OrganisationUnitCodes = {
      SecondLevelCode: "12",
      ThirdLevelCode: "00",
      BottomLevelCode: "00",
      OrganisationUnitCode: "120000"
    }
    expect(forceOwner).toStrictEqual(expectedForceOwner)
  })

  it("Should parse a 4-character long org", () => {
    const forceOwner = createForceOwner("1234")
    const expectedForceOwner: OrganisationUnitCodes = {
      SecondLevelCode: "12",
      ThirdLevelCode: "34",
      BottomLevelCode: "00",
      OrganisationUnitCode: "123400"
    }
    expect(forceOwner).toStrictEqual(expectedForceOwner)
  })

  it("Should return error if less than 2 characters are passed in", () => {
    const result = createForceOwner("1")
    expect(result).toBeInstanceOf(Error)
  })

  it("Should handle multiple organisation code separated by a comma", () => {
    const forceOwner = createForceOwner("12,345678")
    const expectedForceOwner: OrganisationUnitCodes = {
      SecondLevelCode: "12",
      ThirdLevelCode: "00",
      BottomLevelCode: "00",
      OrganisationUnitCode: "120000"
    }
    expect(forceOwner).toStrictEqual(expectedForceOwner)
  })
})
