import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import parseAnnotatedPncUpdateDatasetXml from "@moj-bichard7/core/phase2/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"

import dummyAho from "../tests/fixtures/AnnotatedHO1.json"
import dummyPNCUpdateDataset from "../tests/fixtures/AnnotatedPNCUpdateDataset.json"
import FakeLogger from "../tests/helpers/fakeLogger"
import parseHearingOutcome from "./parseHearingOutcome"

jest.mock("@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml")
jest.mock("@moj-bichard7/core/phase2/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml")

beforeEach(() => {
  ;(parseAhoXml as jest.Mock).mockImplementation(
    jest.requireActual("@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml").default
  )
  ;(parseAnnotatedPncUpdateDatasetXml as jest.Mock).mockImplementation(
    jest.requireActual(
      "@moj-bichard7/core/phase2/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
    ).default
  )
})

afterEach(async () => {
  jest.resetAllMocks()
  jest.clearAllMocks()
})

describe("parseHearingOutcome", () => {
  const logger = new FakeLogger()

  it("Should return the error when hearing outcome XML is invalid", () => {
    expect(parseHearingOutcome("not an XML", logger)).toEqual(new Error("Could not parse AHO XML"))
  })

  it("Should call parseAnnotatedPncUpdateDatasetXml when the XML is a isPncUpdateDataset", () => {
    parseHearingOutcome(dummyPNCUpdateDataset.hearingOutcomeXml, logger)

    expect(parseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledTimes(1)
    expect(parseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledWith(dummyPNCUpdateDataset.hearingOutcomeXml)
  })

  it("Should call parseAhoXml when the XML is not a isPncUpdateDataset", () => {
    parseHearingOutcome(dummyAho.hearingOutcomeXml, logger)

    expect(parseAhoXml).toHaveBeenCalledTimes(1)
    expect(parseAhoXml).toHaveBeenCalledWith(dummyAho.hearingOutcomeXml)
  })
})
