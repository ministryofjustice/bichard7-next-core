import type OrganisationUnitData from "src/types/OrganisationUnitData"
import getCourtDetails from "./getCourtDetails"
import { CROWN_COURT, MC_ADULT, MC_YOUTH, TOP_LEVEL_MAGISTRATES_COURT } from "./properties"

describe("getCourtDetails", () => {
  it("should set Court Type to  MCY when top level code is for Magistrates Court and court name contains word YOUTH", () => {
    const organisationUnitData = {
      topLevelCode: TOP_LEVEL_MAGISTRATES_COURT,
      secondLevelCode: "BC",
      thirdLevelCode: "Contains word 'youth'.",
      bottomLevelCode: "FG"
    } as OrganisationUnitData

    const { courtName, courtType } = getCourtDetails(organisationUnitData)

    expect(courtName).toBe("B BC Contains word 'youth'. FG")
    expect(courtType).toBe(MC_YOUTH)
  })

  it("should set Court Type to  MCA when top level code is for Magistrates Court and court name does not contain word YOUTH", () => {
    const organisationUnitData = {
      topLevelCode: TOP_LEVEL_MAGISTRATES_COURT,
      secondLevelCode: "BC",
      thirdLevelCode: "Does not contain word 'y o u t h'.",
      bottomLevelCode: "FG"
    } as OrganisationUnitData

    const { courtName, courtType } = getCourtDetails(organisationUnitData)

    expect(courtName).toBe("B BC Does not contain word 'y o u t h'. FG")
    expect(courtType).toBe(MC_ADULT)
  })

  it("should set Court Type to  CC when top level code is for Crown Court", () => {
    const organisationUnitData = {
      topLevelCode: "_",
      secondLevelCode: "BC",
      thirdLevelCode: "DE",
      bottomLevelCode: "FG"
    } as OrganisationUnitData

    const { courtName, courtType } = getCourtDetails(organisationUnitData)

    expect(courtName).toBe("_ BC DE FG")
    expect(courtType).toBe(CROWN_COURT)
  })
})
