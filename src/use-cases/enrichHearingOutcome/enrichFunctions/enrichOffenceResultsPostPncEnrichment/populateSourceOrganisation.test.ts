jest.mock("src/use-cases/dataLookup")
import type { AnnotatedHearingOutcome, Result } from "src/types/AnnotatedHearingOutcome"
import populateSourceOrganisation from "./populateSourceOrganisation"
import { lookupOrganisationUnitByThirdLevelPsaCode } from "src/use-cases/dataLookup"

describe("populateSourceOrganisation", () => {
  it("should populate Source Organisation by Court Hearing Location", () => {
    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtHouseCode: 123,
            CourtHearingLocation: {
              TopLevelCode: "a",
              SecondLevelCode: "bc",
              ThirdLevelCode: "de",
              BottomLevelCode: "fg"
            }
          }
        }
      }
    } as AnnotatedHearingOutcome

    const result = {} as Result

    populateSourceOrganisation(result, hearingOutcome)

    expect(result.SourceOrganisation).toBeDefined()

    const { TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode, OrganisationUnitCode } =
      result.SourceOrganisation
    expect(TopLevelCode).toBe("A")
    expect(SecondLevelCode).toBe("BC")
    expect(ThirdLevelCode).toBe("DE")
    expect(BottomLevelCode).toBe("FG")
    expect(OrganisationUnitCode).toBe("ABCDEFG")
  })

  it("should populate Source Organisation by Court House Code", () => {
    const mockedLookupOrganisationUnitByThirdLevelPsaCode =
      lookupOrganisationUnitByThirdLevelPsaCode as jest.MockedFunction<typeof lookupOrganisationUnitByThirdLevelPsaCode>
    mockedLookupOrganisationUnitByThirdLevelPsaCode.mockReturnValue({
      topLevelCode: "h",
      secondLevelCode: "ij",
      thirdLevelCode: "kl",
      bottomLevelCode: "mn"
    })

    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtHouseCode: 123
          }
        }
      }
    } as AnnotatedHearingOutcome

    const result = {} as Result

    populateSourceOrganisation(result, hearingOutcome)

    expect(result.SourceOrganisation).toBeDefined()

    const { TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode, OrganisationUnitCode } =
      result.SourceOrganisation
    expect(TopLevelCode).toBe("H")
    expect(SecondLevelCode).toBe("IJ")
    expect(ThirdLevelCode).toBe("KL")
    expect(BottomLevelCode).toBe("MN")
    expect(OrganisationUnitCode).toBe("HIJKLMN")
  })

  it("should not change Source Organisation if it already has value", () => {
    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtHouseCode: 123,
            CourtHearingLocation: {
              TopLevelCode: "a",
              SecondLevelCode: "bc",
              ThirdLevelCode: "de",
              BottomLevelCode: "fg"
            }
          }
        }
      }
    } as AnnotatedHearingOutcome

    const result = {
      SourceOrganisation: {
        TopLevelCode: "o",
        SecondLevelCode: "pq",
        ThirdLevelCode: "rs",
        BottomLevelCode: "tu"
      }
    } as Result

    populateSourceOrganisation(result, hearingOutcome)

    expect(result.SourceOrganisation).toBeDefined()

    const { TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode, OrganisationUnitCode } =
      result.SourceOrganisation
    expect(TopLevelCode).toBe("O")
    expect(SecondLevelCode).toBe("PQ")
    expect(ThirdLevelCode).toBe("RS")
    expect(BottomLevelCode).toBe("TU")
    expect(OrganisationUnitCode).toBe("OPQRSTU")
  })
})
