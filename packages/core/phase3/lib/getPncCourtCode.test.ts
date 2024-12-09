import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"

import lookupOrganisationUnitByCode from "../../lib/dataLookup/lookupOrganisationUnitByCode"
import getPncCourtCode from "./getPncCourtCode"

jest.mock("../../lib/dataLookup/lookupOrganisationUnitByCode")
describe("getPncCourtCode", () => {
  it("Should return an empty string if organistaionUnitCode is null or undefined", () => {
    const courtHouseCode = 2576

    const pncCourtCodes = getPncCourtCode(null, courtHouseCode)
    expect(pncCourtCodes).toBe("")
  })

  it("Should return the '9998' for the pncCourtCode if the organisationUnitCode value is set to 'B0000'", () => {
    const ouCodes = {
      TopLevelCode: "B",
      SecondLevelCode: "00",
      ThirdLevelCode: "00",
      BottomLevel: "00",
      OrganisationUnitCode: "B0000"
    } as unknown as OrganisationUnitCodes

    const courtHouseCode = 2576

    const pncCourtCodes = getPncCourtCode(ouCodes, courtHouseCode)

    expect(pncCourtCodes).toBe("9998")
  })

  it("Should return the '9998' for the pncCourtCode if the organisationUnitCode doesn't have a bottomLevelCode", () => {
    const ouCodes = {
      TopLevelCode: "B",
      SecondLevelCode: "00",
      ThirdLevelCode: "00",
      BottomLevel: "",
      OrganisationUnitCode: "B0000"
    } as unknown as OrganisationUnitCodes

    const courtHouseCode = 2576

    const pncCourtCodes = getPncCourtCode(ouCodes, courtHouseCode)

    expect(pncCourtCodes).toBe("9998")
  })

  it("Should return an empty string if pncCourtCodes is null or undefined", () => {
    const mockedLookupOrganisationUnitByCode = lookupOrganisationUnitByCode as jest.Mock

    mockedLookupOrganisationUnitByCode.mockReturnValue({
      bottomLevelCode: "00",
      bottomLevelName: "",
      secondLevelCode: "01",
      secondLevelName: "Metropolitan Police Service",
      thirdLevelCode: "AB",
      thirdLevelName: "BELGRAVIA SOUTH WESTMINSTER.OCU",
      thirdLevelPsaCode: "",
      topLevelCode: "",
      topLevelName: "Police Service"
    })

    const ouCodes = {
      TopLevelCode: "B",
      SecondLevelCode: "01",
      ThirdLevelCode: "AB",
      BottomLevelCode: "00",
      OrganisationUnitCode: "B01AB00"
    } as unknown as OrganisationUnitCodes

    const courtHouseCode = 2576

    const pncCourtCodes = getPncCourtCode(ouCodes, courtHouseCode)

    expect(pncCourtCodes).toBe("")
  })

  it("Should check that the 'thirdLevelPsaCode' isNaN", () => {
    const mockedLookupOrganisationUnitByCode = lookupOrganisationUnitByCode as jest.Mock

    mockedLookupOrganisationUnitByCode.mockReturnValue({
      bottomLevelCode: "00",
      bottomLevelName: "",
      secondLevelCode: "20",
      secondLevelName: "West Midlands",
      thirdLevelCode: "BN",
      thirdLevelName: "Birmingham Youth Court (Steelehouse Lane)",
      thirdLevelPsaCode: "I'm not a number",
      topLevelCode: "B",
      topLevelName: "Magistrates' Courts"
    })

    const ouCodes = {
      TopLevelCode: "B",
      SecondLevelCode: "20",
      ThirdLevelCode: "BN",
      BottomLevelCode: "00",
      OrganisationUnitCode: "B20BN00"
    } as unknown as OrganisationUnitCodes

    const courtHouseCode = 4001

    const error = getPncCourtCode(ouCodes, courtHouseCode)

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe("PSA code is not a number")
  })

  it("Should return a youth court code if the courtHouse code is greater than 4000 and third level code is less than 4000", () => {
    const mockedLookupOrganisationUnitByCode = lookupOrganisationUnitByCode as jest.Mock

    mockedLookupOrganisationUnitByCode.mockReturnValue({
      bottomLevelCode: "00",
      bottomLevelName: "",
      secondLevelCode: "20",
      secondLevelName: "West Midlands",
      thirdLevelCode: "BN",
      thirdLevelName: "Birmingham Youth Court (Steelehouse Lane)",
      thirdLevelPsaCode: "3999",
      topLevelCode: "B",
      topLevelName: "Magistrates' Courts"
    })

    const ouCodes = {
      TopLevelCode: "B",
      SecondLevelCode: "20",
      ThirdLevelCode: "BN",
      BottomLevelCode: "00",
      OrganisationUnitCode: "B20BN00"
    } as unknown as OrganisationUnitCodes

    const courtHouseCode = 4001

    const pncCourtCodes = getPncCourtCode(ouCodes, courtHouseCode)

    expect(pncCourtCodes).toBe("7999")
  })

  it("Should return the thirdLevelPsaCode if the courtHouse code is less than 4000 and third level code is greater than 4000", () => {
    const mockedLookupOrganisationUnitByCode = lookupOrganisationUnitByCode as jest.Mock

    mockedLookupOrganisationUnitByCode.mockReturnValue({
      bottomLevelCode: "00",
      bottomLevelName: "",
      secondLevelCode: "20",
      secondLevelName: "West Midlands",
      thirdLevelCode: "BN",
      thirdLevelName: "Birmingham Youth Court (Steelehouse Lane)",
      thirdLevelPsaCode: "4001",
      topLevelCode: "B",
      topLevelName: "Magistrates' Courts"
    })

    const ouCodes = {
      TopLevelCode: "B",
      SecondLevelCode: "20",
      ThirdLevelCode: "BN",
      BottomLevelCode: "00",
      OrganisationUnitCode: "B20BN00"
    } as unknown as OrganisationUnitCodes

    const courtHouseCode = 3999

    const pncCourtCodes = getPncCourtCode(ouCodes, courtHouseCode)

    expect(pncCourtCodes).toBe("4001")
  })
})
