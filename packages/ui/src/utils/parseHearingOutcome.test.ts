import * as parseAhoXmlModule from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import * as parseAnnotatedPncUpdateDatasetXmlModule from "@moj-bichard7/core/lib/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import fs from "fs"
import dummyAho from "../../test/test-data/AnnotatedHO1.json"
import parseHearingOutcome from "./parseHearingOutcome"

describe("parseHearingOutcome", () => {
  it("Should return the error when hearing outcome XML is invalid", () => {
    expect(parseHearingOutcome("not an XML")).toEqual(new Error("Could not parse AHO XML"))
  })

  it("Should call parseAnnotatedPncUpdateDatasetXml when the XML is a isPncUpdateDataset", () => {
    const spy = jest.spyOn(parseAnnotatedPncUpdateDatasetXmlModule, "default")
    const dummyPNCUpdateDataset = fs.readFileSync("test/test-data/AnnotatedPNCUpdateDataset.xml").toString()
    parseHearingOutcome(dummyPNCUpdateDataset)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(dummyPNCUpdateDataset)
  })

  it("Should call parseAhoXml when the XML is not a isPncUpdateDataset", () => {
    const spy = jest.spyOn(parseAhoXmlModule, "default")
    parseHearingOutcome(dummyAho.hearingOutcomeXml)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(dummyAho.hearingOutcomeXml)
  })
})
