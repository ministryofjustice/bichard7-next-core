import fs from "fs"
import "jest-xml-matcher"
import { parsePncUpdateDataSetXml } from "../../../phase2/parse/parsePncUpdateDataSetXml"
import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"
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
