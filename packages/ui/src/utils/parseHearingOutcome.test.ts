import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import parseAnnotatedPncUpdateDatasetXml from "@moj-bichard7/core/lib/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import fs from "fs"
import dummyAho from "../../test/test-data/AnnotatedHO1.json"
import parseHearingOutcome from "./parseHearingOutcome"

jest.mock("@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml")
jest.mock("@moj-bichard7/core/lib/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml")

beforeEach(() => {
  ;(parseAhoXml as jest.Mock).mockImplementation(
    jest.requireActual("@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml").default
  )
  ;(parseAnnotatedPncUpdateDatasetXml as jest.Mock).mockImplementation(
    jest.requireActual(
      "@moj-bichard7/core/lib/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
    ).default
  )
})

afterEach(async () => {
  jest.resetAllMocks()
  jest.clearAllMocks()
})

describe("parseHearingOutcome", () => {
  it("Should return the error when hearing outcome XML is invalid", () => {
    expect(parseHearingOutcome("not an XML")).toEqual(new Error("Could not parse AHO XML"))
  })

  it("Should call parseAnnotatedPncUpdateDatasetXml when the XML is a isPncUpdateDataset", () => {
    const dummyPNCUpdateDataset = fs.readFileSync("test/test-data/AnnotatedPNCUpdateDataset.xml").toString()
    parseHearingOutcome(dummyPNCUpdateDataset)

    expect(parseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledTimes(1)
    expect(parseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledWith(dummyPNCUpdateDataset)
  })

  it("Should call parseAhoXml when the XML is not a isPncUpdateDataset", () => {
    parseHearingOutcome(dummyAho.hearingOutcomeXml)

    expect(parseAhoXml).toHaveBeenCalledTimes(1)
    expect(parseAhoXml).toHaveBeenCalledWith(dummyAho.hearingOutcomeXml)
  })
})
