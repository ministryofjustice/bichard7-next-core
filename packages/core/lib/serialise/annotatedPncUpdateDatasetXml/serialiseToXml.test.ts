import fs from "fs"
import "jest-xml-matcher"
import parseAnnotatedPncUpdateDatasetXml from "../../../phase2/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import type AnnotatedPncUpdateDataset from "../../../types/AnnotatedPncUpdateDataset"
import serialiseToXml from "./serialiseToXml"

describe("serialiseToXml", () => {
  it("Parsing and serialising XML file results in the same XML", () => {
    const inputMessage = fs.readFileSync("phase2/tests/fixtures/AnnotatedPncUpdateDataset.xml").toString()
    const parsedAnnotatedPncUpdateDataset = parseAnnotatedPncUpdateDatasetXml(inputMessage) as AnnotatedPncUpdateDataset
    const serialisedAnnotatedPncUpdateDataset = serialiseToXml(
      parsedAnnotatedPncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
    )

    expect(serialisedAnnotatedPncUpdateDataset).toEqualXML(inputMessage)
  })
})
