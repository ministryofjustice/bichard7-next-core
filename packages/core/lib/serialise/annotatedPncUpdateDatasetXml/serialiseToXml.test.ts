import type AnnotatedPncUpdateDataset from "@moj-bichard7/common/types/AnnotatedPncUpdateDataset"

import parseAnnotatedPncUpdateDatasetXml from "@moj-bichard7/common/aho/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import fs from "fs"
import "jest-xml-matcher"

import serialiseToXml from "./serialiseToXml"

describe("serialiseToXml", () => {
  it.each([
    "AnnotatedPncUpdateDataset-without-exception.xml",
    "AnnotatedPncUpdateDataset-with-exception.xml",
    "AnnotatedPncUpdateDataset-with-pnc-errors.xml"
  ])("Parsing and serialising XML file %s results in the same XML", (xmlFile) => {
    const inputMessage = fs.readFileSync(`phase2/tests/fixtures/${xmlFile}`).toString()
    const parsedAnnotatedPncUpdateDataset = parseAnnotatedPncUpdateDatasetXml(inputMessage) as AnnotatedPncUpdateDataset

    const serialisedAnnotatedPncUpdateDataset = serialiseToXml(
      parsedAnnotatedPncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
    )

    expect(serialisedAnnotatedPncUpdateDataset).toEqualXML(inputMessage)
  })
})
