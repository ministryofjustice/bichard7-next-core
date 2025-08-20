import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { parsePncUpdateDataSetXml } from "@moj-bichard7/common/aho/parse/parsePncUpdateDataSetXml/index"
import "jest-xml-matcher"
import fs from "fs"

import serialiseToXml from "./serialiseToXml"

describe("serialiseToXml", () => {
  it.each([
    "PncUpdateDataSet-with-operations.xml",
    "PncUpdateDataSet-no-operations.xml",
    "PncUpdateDataSet-with-single-NEWREM.xml",
    "PncUpdateDataSet-with-result-class-error.xml",
    "PncUpdateDataSet-without-hasError-attributes.xml"
  ])("Parsing and serialising XML file %s results in the same XML", (xmlFilePath) => {
    const inputMessage = fs.readFileSync(`phase2/tests/fixtures/${xmlFilePath}`).toString()
    const parsedPncUpdateDataset = parsePncUpdateDataSetXml(inputMessage) as PncUpdateDataset
    const serialisedPncUpdateDataset = serialiseToXml(parsedPncUpdateDataset)

    expect(serialisedPncUpdateDataset).toEqualXML(inputMessage)
  })
})
