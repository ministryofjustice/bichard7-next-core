jest.mock("../../../../lib/dataLookup")
import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/types/types"

import type { AnnotatedHearingOutcome, Result } from "../../../../types/AnnotatedHearingOutcome"

import { lookupOrganisationUnitByThirdLevelPsaCode } from "../../../../lib/dataLookup"
import populateSourceOrganisation from "./populateSourceOrganisation"

describe("populateSourceOrganisation", () => {
  it("should populate Source Organisation by Court Hearing Location", () => {
    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtHearingLocation: {
              BottomLevelCode: "fg",
              SecondLevelCode: "bc",
              ThirdLevelCode: "de",
              TopLevelCode: "a"
            },
            CourtHouseCode: 123
          }
        }
      }
    } as AnnotatedHearingOutcome

    const result = {} as Result

    populateSourceOrganisation(result, hearingOutcome)

    expect(result.SourceOrganisation).toBeDefined()

    const { BottomLevelCode, OrganisationUnitCode, SecondLevelCode, ThirdLevelCode, TopLevelCode } =
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
      bottomLevelCode: "mn",
      secondLevelCode: "ij",
      thirdLevelCode: "kl",
      topLevelCode: "h"
    } as OrganisationUnit)

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

    const { BottomLevelCode, OrganisationUnitCode, SecondLevelCode, ThirdLevelCode, TopLevelCode } =
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
            CourtHearingLocation: {
              BottomLevelCode: "fg",
              SecondLevelCode: "bc",
              ThirdLevelCode: "de",
              TopLevelCode: "a"
            },
            CourtHouseCode: 123
          }
        }
      }
    } as AnnotatedHearingOutcome

    const result = {
      SourceOrganisation: {
        BottomLevelCode: "tu",
        SecondLevelCode: "pq",
        ThirdLevelCode: "rs",
        TopLevelCode: "o"
      }
    } as Result

    populateSourceOrganisation(result, hearingOutcome)

    expect(result.SourceOrganisation).toBeDefined()

    const { BottomLevelCode, OrganisationUnitCode, SecondLevelCode, ThirdLevelCode, TopLevelCode } =
      result.SourceOrganisation
    expect(TopLevelCode).toBe("O")
    expect(SecondLevelCode).toBe("PQ")
    expect(ThirdLevelCode).toBe("RS")
    expect(BottomLevelCode).toBe("TU")
    expect(OrganisationUnitCode).toBe("OPQRSTU")
  })
})
