import type { OrganisationUnitCodes } from "types/AnnotatedHearingOutcome"
import populateOrganisationUnitFields from "./populateOrganisationUnitFields"

describe("populateOrganisationUnitFields", () => {
  it("should populate top, second, third, and bottom levels by organisation unit code", () => {
    const organisationUnit = {
      OrganisationUnitCode: "abcdefg"
    } as OrganisationUnitCodes

    const result = populateOrganisationUnitFields(organisationUnit)

    const { TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode, OrganisationUnitCode } = result
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

    const { TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode, OrganisationUnitCode } = result
    expect(OrganisationUnitCode).toBe("BCDEFG")
    expect(TopLevelCode).toBeUndefined()
    expect(SecondLevelCode).toBe("BC")
    expect(ThirdLevelCode).toBe("DE")
    expect(BottomLevelCode).toBe("FG")
  })

  it("should populate organisation unit code by top, second, third, and bottom levels", () => {
    const organisationUnit = {
      TopLevelCode: "a",
      SecondLevelCode: "bc",
      ThirdLevelCode: "de",
      BottomLevelCode: "fg"
    } as OrganisationUnitCodes

    const result = populateOrganisationUnitFields(organisationUnit)

    const { TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode, OrganisationUnitCode } = result
    expect(OrganisationUnitCode).toBe("ABCDEFG")
    expect(TopLevelCode).toBe("A")
    expect(SecondLevelCode).toBe("BC")
    expect(ThirdLevelCode).toBe("DE")
    expect(BottomLevelCode).toBe("FG")
  })
})
