import type OrganisationUnitData from "src/types/OrganisationUnitData"
import getCourtDetails from "./getCourtDetails"
import { CROWN_COURT, MC_ADULT, MC_YOUTH, TOP_LEVEL_MAGISTRATES_COURT } from "./properties"

describe("getCourtDetails", () => {
  it("should set Court Type to  MCY when top level code is for Magistrates Court and court name contains word YOUTH", () => {
    const organisationUnitData = {
      topLevelCode: TOP_LEVEL_MAGISTRATES_COURT,
      secondLevelCode: "20",
      thirdLevelCode: "BN",
      bottomLevelCode: "00"
    } as OrganisationUnitData

    const { courtName, courtType } = getCourtDetails(organisationUnitData)

    expect(courtName).toBe("West Midlands Birmingham Youth Court (Steelehouse Lane)")
    expect(courtType).toBe(MC_YOUTH)
  })

  it("should set Court Type to  MCA when top level code is for Magistrates Court and court name does not contain word YOUTH", () => {
    const organisationUnitData = {
      topLevelCode: TOP_LEVEL_MAGISTRATES_COURT,
      secondLevelCode: "20",
      thirdLevelCode: "BL",
      bottomLevelCode: "00"
    } as OrganisationUnitData

    const { courtName, courtType } = getCourtDetails(organisationUnitData)

    expect(courtName).toBe("West Midlands Birmingham (Corporation St)")
    expect(courtType).toBe(MC_ADULT)
  })

  it("should set Court Type to  CC when top level code is for Crown Court", () => {
    const organisationUnitData = {
      topLevelCode: "C",
      secondLevelCode: "20",
      thirdLevelCode: "CO",
      bottomLevelCode: "00"
    } as OrganisationUnitData

    const { courtName, courtType } = getCourtDetails(organisationUnitData)

    expect(courtName).toBe("Crown Courts West Midlands Coventry")
    expect(courtType).toBe(CROWN_COURT)
  })
})
