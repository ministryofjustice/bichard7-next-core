import fs from "fs"
import path from "path"

import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type AnnotatedPncUpdateDataset from "../types/AnnotatedPncUpdateDataset"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"

import parseAnnotatedPncUpdateDatasetXml from "./parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import { parsePncUpdateDataSetXml } from "./parse/parsePncUpdateDataSetXml"
import parseAhoXml from "./parseAhoXml/parseAhoXml"
import { parseHearingOutcome } from "./parseHearingOutcome"

jest.mock("./parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml")
jest.mock("./parse/parsePncUpdateDataSetXml")
jest.mock("./parseAhoXml/parseAhoXml")

const mockParseAnnotatedPncUpdateDatasetXml = jest.mocked(parseAnnotatedPncUpdateDatasetXml)
const mockParsePncUpdateDataSetXml = jest.mocked(parsePncUpdateDataSetXml)
const mockParseAhoXml = jest.mocked(parseAhoXml)

describe("parseHearingOutcome", () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it("Should return the error when hearing outcome XML is invalid", () => {
    const annotatedError = new Error("XML is not a PNC update dataset")
    const pncError = new Error("XML is not a PNC update dataset")
    const ahoError = new Error("Could not parse AHO XML")

    mockParseAnnotatedPncUpdateDatasetXml.mockReturnValue(annotatedError)
    mockParsePncUpdateDataSetXml.mockReturnValue(pncError)
    mockParseAhoXml.mockReturnValue(ahoError)

    const result = parseHearingOutcome("not an XML")

    expect(result).toEqual(ahoError)
    expect(mockParseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledWith("not an XML")
    expect(mockParsePncUpdateDataSetXml).toHaveBeenCalledWith("not an XML")
    expect(mockParseAhoXml).toHaveBeenCalledWith("not an XML")
  })

  it("Should call parseAnnotatedPncUpdateDatasetXml when the XML is an AnnotatedPncUpdateDataset", () => {
    const annotatedPncUpdateDataset = fs
      .readFileSync(path.resolve(__dirname, "./parse/fixtures/AnnotatedPncUpdateDataset.xml"))
      .toString()

    const mockResult = {
      AnnotatedPNCUpdateDataset: {
        PNCUpdateDataset: { mockData: "annotated result" }
      }
    } as unknown as AnnotatedPncUpdateDataset

    mockParseAnnotatedPncUpdateDatasetXml.mockReturnValue(mockResult)

    const result = parseHearingOutcome(annotatedPncUpdateDataset)

    expect(result).toEqual(mockResult.AnnotatedPNCUpdateDataset.PNCUpdateDataset)
    expect(mockParseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledTimes(1)
    expect(mockParseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledWith(annotatedPncUpdateDataset)
    expect(mockParsePncUpdateDataSetXml).not.toHaveBeenCalled()
    expect(mockParseAhoXml).not.toHaveBeenCalled()
  })

  it("Should call parsePncUpdateDatasetXml when the XML is a pncUpdateDataset", () => {
    const pncUpdateDataset = fs
      .readFileSync(path.resolve(__dirname, "./parse/fixtures/PNCUpdateDataset.xml"))
      .toString()

    const mockPncResult = { mockData: "pnc result" } as unknown as PncUpdateDataset

    mockParseAnnotatedPncUpdateDatasetXml.mockReturnValue(new Error("Not annotated dataset"))
    mockParsePncUpdateDataSetXml.mockReturnValue(mockPncResult)

    const result = parseHearingOutcome(pncUpdateDataset)

    expect(result).toEqual(mockPncResult)
    expect(mockParseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledTimes(1)
    expect(mockParseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledWith(pncUpdateDataset)
    expect(mockParsePncUpdateDataSetXml).toHaveBeenCalledTimes(1)
    expect(mockParsePncUpdateDataSetXml).toHaveBeenCalledWith(pncUpdateDataset)
    expect(mockParseAhoXml).not.toHaveBeenCalled()
  })

  it("Should call parseAhoXml when the XML is not a isPncUpdateDataset", () => {
    const dummyAho = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "./parseAhoXml/fixtures/AnnotatedHO1.json")).toString()
    )

    const mockAhoResult = { mockData: "aho result" } as unknown as AnnotatedHearingOutcome

    mockParseAnnotatedPncUpdateDatasetXml.mockReturnValue(new Error("Not annotated dataset"))
    mockParsePncUpdateDataSetXml.mockReturnValue(new Error("Not PNC dataset"))
    mockParseAhoXml.mockReturnValue(mockAhoResult)

    const result = parseHearingOutcome(dummyAho.hearingOutcomeXml)

    expect(result).toEqual(mockAhoResult)
    expect(mockParseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledTimes(1)
    expect(mockParseAnnotatedPncUpdateDatasetXml).toHaveBeenCalledWith(dummyAho.hearingOutcomeXml)
    expect(mockParsePncUpdateDataSetXml).toHaveBeenCalledTimes(1)
    expect(mockParsePncUpdateDataSetXml).toHaveBeenCalledWith(dummyAho.hearingOutcomeXml)
    expect(mockParseAhoXml).toHaveBeenCalledTimes(1)
    expect(mockParseAhoXml).toHaveBeenCalledWith(dummyAho.hearingOutcomeXml)
  })

  it("Should log error when AHO parsing fails and logger is provided", () => {
    const mockLogger = { error: jest.fn() }
    const ahoError = new Error("Could not parse AHO XML")

    mockParseAnnotatedPncUpdateDatasetXml.mockReturnValue(new Error("Not annotated dataset"))
    mockParsePncUpdateDataSetXml.mockReturnValue(new Error("Not PNC dataset"))
    mockParseAhoXml.mockReturnValue(ahoError)

    const result = parseHearingOutcome("invalid xml", mockLogger)

    expect(result).toEqual(ahoError)
    expect(mockLogger.error).toHaveBeenCalledWith(`Failed to parse aho: ${ahoError}`)
  })

  it("Should not log error when no logger is provided", () => {
    const ahoError = new Error("Could not parse AHO XML")

    mockParseAnnotatedPncUpdateDatasetXml.mockReturnValue(new Error("Not annotated dataset"))
    mockParsePncUpdateDataSetXml.mockReturnValue(new Error("Not PNC dataset"))
    mockParseAhoXml.mockReturnValue(ahoError)

    const result = parseHearingOutcome("invalid xml")

    expect(result).toEqual(ahoError)
  })
})
