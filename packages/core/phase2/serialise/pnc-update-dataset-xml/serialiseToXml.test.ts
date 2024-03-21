import fs from "fs"
import "jest-xml-matcher"
import { parsePncUpdateDataSetXml } from "../../parse/parsePncUpdateDataSetXml"
import serialiseToXml from "./serialiseToXml"
import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"

describe("serialiseToXml", () => {
  it.each(["PncUpdateDataSet-with-operations.xml", "PncUpdateDataSet-no-operations.xml"])(
    "Parsing and serialising XML file %s results in the same XML",
    (xmlFilePath) => {
      const inputMessage = fs.readFileSync(`phase2/tests/fixtures/${xmlFilePath}`).toString()
      const parsedPncUpdateDataset = parsePncUpdateDataSetXml(inputMessage) as PncUpdateDataset
      const serialisedPncUpdateDataset = serialiseToXml(parsedPncUpdateDataset)

      expect(serialisedPncUpdateDataset).toEqualXML(inputMessage)
    }
  )
})
