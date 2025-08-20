import * as parseAnnotatedPncUpdateDatasetXmlModule from "@moj-bichard7/common/aho/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import * as parsePncUpdateDataSetXmlModule from "@moj-bichard7/common/aho/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import * as parseAhoXmlModule from "@moj-bichard7/common/aho/parseAhoXml/parseAhoXml"
import fs from "fs"
import path from "path"

import dummyAho from "../tests/fixtures/AnnotatedHO1.json"
import FakeLogger from "../tests/helpers/fakeLogger"
import parseHearingOutcome from "./parseHearingOutcome"
const logger = new FakeLogger()

describe("parseHearingOutcome", () => {
  it("Should return the error when hearing outcome XML is invalid", () => {
    expect(parseHearingOutcome("not an XML", logger)).toEqual(new Error("Could not parse AHO XML"))
  })

  it("Should call parseAnnotatedPncUpdateDatasetXml when the XML is an AnnotatedPncUpdateDataset", () => {
    const spy = jest.spyOn(parseAnnotatedPncUpdateDatasetXmlModule, "default")
    const annotatedPncUpdateDataset = fs
      .readFileSync(path.resolve(__dirname, "../tests/fixtures/AnnotatedPNCUpdateDataset.xml"))
      .toString()
    parseHearingOutcome(annotatedPncUpdateDataset, logger)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(annotatedPncUpdateDataset)
  })

  it("Should call parsePncUpdateDatasetXml when the XML is a pncUpdateDataset", () => {
    const spy = jest.spyOn(parsePncUpdateDataSetXmlModule, "default")
    const pncUpdateDataset = fs
      .readFileSync(path.resolve(__dirname, "../tests/fixtures/PNCUpdateDataset.xml"))
      .toString()
    parseHearingOutcome(pncUpdateDataset, logger)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(pncUpdateDataset)
  })

  it("Should call parseAhoXml when the XML is not a isPncUpdateDataset", () => {
    const spy = jest.spyOn(parseAhoXmlModule, "default")
    parseHearingOutcome(dummyAho.hearingOutcomeXml, logger)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(dummyAho.hearingOutcomeXml)
  })
})
