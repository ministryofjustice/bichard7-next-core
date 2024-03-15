import fs from "fs"
import "jest-xml-matcher"
import { parsePncUpdateDataSetXml } from "../../parse/parsePncUpdateDataSetXml"
import serialiseToXml from "./serialiseToXml"
import { PncUpdateDataset } from "../../../types/PncUpdateDataset"


describe("generateLegacyPncUpdateDatasetXml", () => {
  it.ifNewBichard("serialiseToXml serialises PncUpdateDataset into legacy XML containing an aho element", async () => {
    const inputMessage = fs.readFileSync("phase2/tests/fixtures/PncUpdateDataSet-with-operations.xml").toString()
    const parsedPncUpdateDataset = parsePncUpdateDataSetXml(inputMessage) as PncUpdateDataset
    const serialisedPncUpdateDataset = serialiseToXml(parsedPncUpdateDataset)
        
    expect(serialisedPncUpdateDataset.match(/<br7:AnnotatedHearingOutcome/))
  })
})

//@TODO
// expect(serialisedPncUpdateDataset).toEqual(inputMessage)