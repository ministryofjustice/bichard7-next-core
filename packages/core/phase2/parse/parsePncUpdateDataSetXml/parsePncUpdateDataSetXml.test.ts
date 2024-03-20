import fs from "fs"
import path from "path"
import "jest-xml-matcher"
import parsePncUpdateDataSetXml from "./parsePncUpdateDataSetXml"

describe("parsePncUpdateDataSetXml", () => {
  const inputDirectory = "phase2/tests/fixtures/"
  const inputFiles = [
    "PncUpdateDataSet-with-operations.xml",
    "PncUpdateDataSet-no-operations.xml",
    "PncUpdateDataSet-with-empty-operations.xml",
    "PncUpdateDataSet-unexpected-element.xml",
  ]
  inputFiles.forEach((file) => {
    const filePath = path.join(inputDirectory, file)
    it("converts XML from file ${filePath} to PncUpdateDataSet", () => {
      const inputXml = fs.readFileSync(filePath).toString()
      const parsedPncUpdateDatasetAho = parsePncUpdateDataSetXml(inputXml)
    
      expect(parsedPncUpdateDatasetAho).toMatchSnapshot()
    })
  })
})