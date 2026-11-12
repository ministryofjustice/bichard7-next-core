import fs from "node:fs"
import type { OrganisationUnit } from "@moj-bichard7/standing-data/types/types"
import { convertOrgUnitDataXls } from "./convertOrgUnitDataXls"

describe("GeneratePoliceUnits", () => {
  it("should not include empty rows", () => {
    const fileContents = fs.readFileSync("./test-data/input/INC275907.UT400J.FSCODES-short.xlsx")
    const policeData = convertOrgUnitDataXls(fileContents)

    expect(policeData).toHaveLength(4)

    expect(policeData[0]).toEqual({
      topLevelName: "Police Service",
      secondLevelName: "Metropolitan Police Service",
      thirdLevelName: "PNC SPECIALIST ENQUIRIES (FORMERLY-PNC- POLICY AND PLANNING)",
      bottomLevelName: "",
      topLevelCode: "",
      secondLevelCode: "01",
      thirdLevelCode: "00",
      bottomLevelCode: "00",
      thirdLevelPsaCode: ""
    } as OrganisationUnit)

    expect(policeData[1]).toEqual({
      topLevelName: "Police Service",
      secondLevelName: "Metropolitan Police Service",
      thirdLevelName: "BELGRAVIA SOUTH WESTMINSTER.OCU",
      bottomLevelName: "",
      topLevelCode: "",
      secondLevelCode: "01",
      thirdLevelCode: "AB",
      bottomLevelCode: "00",
      thirdLevelPsaCode: ""
    } as OrganisationUnit)

    expect(policeData[2]).toEqual({
      topLevelName: "Police Service",
      secondLevelName: "Metropolitan Police Service",
      thirdLevelName: "DIRECTORATE PROFESSIONAL STANDARD (DPS) PROSECUTION",
      bottomLevelName: "",
      topLevelCode: "",
      secondLevelCode: "01",
      thirdLevelCode: "AC",
      bottomLevelCode: "00",
      thirdLevelPsaCode: ""
    } as OrganisationUnit)

    expect(policeData[3]).toEqual({
      topLevelName: "Police Service",
      secondLevelName: "Metropolitan Police Service",
      thirdLevelName: "BELGRAVIA POLICE STATION PART OF CITY OF WESTMINSTER BOROUGH",
      bottomLevelName: "",
      topLevelCode: "",
      secondLevelCode: "01",
      thirdLevelCode: "AD",
      bottomLevelCode: "00",
      thirdLevelPsaCode: ""
    } as OrganisationUnit)
  })
})
