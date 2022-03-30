jest.mock("src/use-cases/dataLookup")
jest.mock("src/lib/getCourtDetails")
import getCourtDetails from "src/lib/getCourtDetails"
import type { AnnotatedHearingOutcome, Result } from "src/types/AnnotatedHearingOutcome"
import { lookupOrganisationUnitByCode } from "src/use-cases/dataLookup"
import populateCourt from "./populateCourt"

const mockedLookupOrganisationUnitByCode = lookupOrganisationUnitByCode as jest.MockedFunction<
  typeof lookupOrganisationUnitByCode
>
const mockedGetCourtDetails = getCourtDetails as jest.MockedFunction<typeof getCourtDetails>
const mockLookupOrganisationUnitByCodeToReturnValue = () =>
  mockedLookupOrganisationUnitByCode.mockReturnValue({
    topLevelCode: "",
    secondLevelCode: "",
    thirdLevelCode: "",
    bottomLevelCode: ""
  })

const hearingOutcome = {
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Hearing: {}
    }
  }
} as AnnotatedHearingOutcome

describe("populateCourt", () => {
  it("should set Court Type and unset NextResultSourceOrganisation", () => {
    mockLookupOrganisationUnitByCodeToReturnValue()
    mockedGetCourtDetails.mockReturnValue({
      courtName: "",
      courtType: "Dummy Court Type"
    })

    const result = { NextResultSourceOrganisation: {}, SourceOrganisation: {} } as Result

    populateCourt(result, hearingOutcome)

    expect(result.CourtType).toBe("Dummy Court Type")
    expect(result.NextCourtType).toBeUndefined()
    expect(result.NextResultSourceOrganisation).toBeUndefined()
  })

  it("should set Court Type and Next Court Type", () => {
    mockLookupOrganisationUnitByCodeToReturnValue()
    let CourtTypeIndex = 1
    mockedGetCourtDetails.mockImplementation(() => ({
      courtName: "",
      courtType: `Dummy Court Type ${CourtTypeIndex++}`
    }))

    const result = {
      NextResultSourceOrganisation: { OrganisationUnitCode: "ABCDEFG" },
      SourceOrganisation: {}
    } as Result

    populateCourt(result, hearingOutcome)

    expect(result.CourtType).toBe("Dummy Court Type 1")
    expect(result.NextCourtType).toBe("Dummy Court Type 2")
    expect(result.NextResultSourceOrganisation).toStrictEqual({
      TopLevelCode: "A",
      SecondLevelCode: "BC",
      ThirdLevelCode: "DE",
      BottomLevelCode: "FG",
      OrganisationUnitCode: "ABCDEFG"
    })
  })

  it("should not set Court Type and Next Court Type when fail to lookup source organisation", () => {
    mockedLookupOrganisationUnitByCode.mockReturnValue(undefined)

    const result = {
      NextResultSourceOrganisation: { OrganisationUnitCode: "ABCDEFG" },
      SourceOrganisation: {}
    } as Result

    populateCourt(result, hearingOutcome)

    expect(result.CourtType).toBeUndefined()
    expect(result.NextCourtType).toBeUndefined()
    expect(result.NextResultSourceOrganisation).toStrictEqual({
      TopLevelCode: "A",
      SecondLevelCode: "BC",
      ThirdLevelCode: "DE",
      BottomLevelCode: "FG",
      OrganisationUnitCode: "ABCDEFG"
    })
  })
})
