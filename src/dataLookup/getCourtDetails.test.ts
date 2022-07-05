import { CROWN_COURT, MC_ADULT, MC_YOUTH, TOP_LEVEL_MAGISTRATES_COURT } from "src/lib/properties"
import type { OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"
import getCourtDetails from "./getCourtDetails"

describe("getCourtDetails", () => {
  it("should set Court Type to  MCY when top level code is for Magistrates Court and court name contains word YOUTH", () => {
    const organisationUnitData = {
      TopLevelCode: TOP_LEVEL_MAGISTRATES_COURT,
      SecondLevelCode: "20",
      ThirdLevelCode: "BN",
      BottomLevelCode: "00"
    } as OrganisationUnitCodes

    const { courtName, courtType } = getCourtDetails(organisationUnitData)

    expect(courtName).toBe("Magistrates' Courts West Midlands Birmingham Youth Court (Steelehouse Lane)")
    expect(courtType).toBe(MC_YOUTH)
  })

  it("should set Court Type to  MCA when top level code is for Magistrates Court and court name does not contain word YOUTH", () => {
    const organisationUnitData = {
      TopLevelCode: TOP_LEVEL_MAGISTRATES_COURT,
      SecondLevelCode: "20",
      ThirdLevelCode: "BL",
      BottomLevelCode: "00"
    } as OrganisationUnitCodes

    const { courtName, courtType } = getCourtDetails(organisationUnitData)

    expect(courtName).toBe("Magistrates' Courts West Midlands Birmingham (Corporation St)")
    expect(courtType).toBe(MC_ADULT)
  })

  it("should set Court Type to  CC when top level code is for Crown Court", () => {
    const organisationUnitData = {
      TopLevelCode: "C",
      SecondLevelCode: "20",
      ThirdLevelCode: "CO",
      BottomLevelCode: "00"
    } as OrganisationUnitCodes

    const { courtName, courtType } = getCourtDetails(organisationUnitData)

    expect(courtName).toBe("Crown Courts West Midlands Coventry")
    expect(courtType).toBe(CROWN_COURT)
  })
})
