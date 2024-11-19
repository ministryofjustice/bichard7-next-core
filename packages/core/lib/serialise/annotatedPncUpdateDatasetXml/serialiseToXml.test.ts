import fs from "fs"
import "jest-xml-matcher"
import parseAnnotatedPncUpdateDatasetXml from "../../../phase2/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import type AnnotatedPncUpdateDataset from "../../../types/AnnotatedPncUpdateDataset"
import serialiseToXml from "./serialiseToXml"

describe("serialiseToXml", () => {
  it.each(["AnnotatedPncUpdateDataset-without-exception.xml", "AnnotatedPncUpdateDataset-with-exception.xml"])(
    "Parsing and serialising XML file %s results in the same XML",
    (xmlFile) => {
      const inputMessage = fs.readFileSync(`phase2/tests/fixtures/${xmlFile}`).toString()
      const parsedAnnotatedPncUpdateDataset = parseAnnotatedPncUpdateDatasetXml(
        inputMessage
      ) as AnnotatedPncUpdateDataset

      const serialisedAnnotatedPncUpdateDataset = serialiseToXml(
        parsedAnnotatedPncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
      )

      expect(serialisedAnnotatedPncUpdateDataset).toEqualXML(inputMessage)
    }
  )
})
