import fs from "fs"
import MockDate from "mockdate"
import generateOrganisationUnitObjects from "./generateCourtOrganisationUnits"
import type { OrganisationUnit } from "../types/OrganisationUnit"

afterEach(() => {
  MockDate.reset()
})

describe("GenerateOrganisationUnit", () => {
  it("should generate JSON output from the XLS content", () => {
    MockDate.set(new Date("2008-07-07").getTime())

    const fileContents = fs.readFileSync("./test-data/input/test-ou-codes.xlsx")
    const expectedContent: OrganisationUnit[] = [
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "AA",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare",
        bottomLevelName: "",
        thirdLevelPsaCode: ""
      },
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "WL",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare (County Court, Cwmbach Road)",
        bottomLevelName: "",
        thirdLevelPsaCode: ""
      },
      {
        topLevelCode: "B",
        secondLevelCode: "62",
        thirdLevelCode: "AB",
        bottomLevelCode: "00",
        topLevelName: "Magistrates' Courts",
        secondLevelName: "South Wales",
        thirdLevelName: "Aberdare Youth Court",
        bottomLevelName: "",
        thirdLevelPsaCode: ""
      }
    ]
    expect(generateOrganisationUnitObjects(fileContents)).toEqual(expectedContent)
  })

  it("should not include empty rows", () => {
    MockDate.set(new Date("2022-05-13").getTime())

    const fileContentsWithEmptyRows = fs.readFileSync("./test-data/input/cjs-courts-bc-ou-codes-v32.xls.xlsx")
    expect(generateOrganisationUnitObjects(fileContentsWithEmptyRows)).toHaveLength(438)
  })

  it("should filter records by start and end date", () => {
    MockDate.set(new Date("2014-12-01").getTime())

    const fileContents = fs.readFileSync("./test-data/input/test-ou-codes.xlsx")
    expect(generateOrganisationUnitObjects(fileContents)).toEqual([])
  })
})
