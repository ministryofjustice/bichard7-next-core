import type { OrganisationUnitCodes } from "../../../types/AnnotatedHearingOutcome"

import populateOrganisationUnitFields from "./populateOrganisationUnitFields"

describe("populateOrganisationUnitFields", () => {
  it("should populate top, second, third, and bottom levels by organisation unit code", () => {
    const organisationUnit = {
      OrganisationUnitCode: "abcdefg"
    } as OrganisationUnitCodes

    const result = populateOrganisationUnitFields(organisationUnit)

    const { BottomLevelCode, OrganisationUnitCode, SecondLevelCode, ThirdLevelCode, TopLevelCode } = result
    expect(OrganisationUnitCode).toBe("ABCDEFG")
    expect(TopLevelCode).toBe("A")
    expect(SecondLevelCode).toBe("BC")
    expect(ThirdLevelCode).toBe("DE")
    expect(BottomLevelCode).toBe("FG")
  })

  it("should populate second, third, and bottom levels by organisation unit code", () => {
    const organisationUnit = {
      OrganisationUnitCode: "bcdefg"
    } as OrganisationUnitCodes

    const result = populateOrganisationUnitFields(organisationUnit)

    const { BottomLevelCode, OrganisationUnitCode, SecondLevelCode, ThirdLevelCode, TopLevelCode } = result
    expect(OrganisationUnitCode).toBe("BCDEFG")
    expect(TopLevelCode).toBeUndefined()
    expect(SecondLevelCode).toBe("BC")
    expect(ThirdLevelCode).toBe("DE")
    expect(BottomLevelCode).toBe("FG")
  })

  it("should populate organisation unit code by top, second, third, and bottom levels", () => {
    const organisationUnit = {
      BottomLevelCode: "fg",
      SecondLevelCode: "bc",
      ThirdLevelCode: "de",
      TopLevelCode: "a"
    } as OrganisationUnitCodes

    const result = populateOrganisationUnitFields(organisationUnit)

    const { BottomLevelCode, OrganisationUnitCode, SecondLevelCode, ThirdLevelCode, TopLevelCode } = result
    expect(OrganisationUnitCode).toBe("ABCDEFG")
    expect(TopLevelCode).toBe("A")
    expect(SecondLevelCode).toBe("BC")
    expect(ThirdLevelCode).toBe("DE")
    expect(BottomLevelCode).toBe("FG")
  })
})
