import { isError } from "@moj-bichard7/common/types/Result"
import fs from "fs"
import "jest-xml-matcher"
import path from "path"

import pncUpdateDatasetSchema from "../../../schemas/pncUpdateDataset"
import parsePncUpdateDataSetXml from "./parsePncUpdateDataSetXml"

describe("parsePncUpdateDataSetXml", () => {
  const inputDirectory = "phase2/tests/fixtures/"
  const inputFiles = [
    "PncUpdateDataSet-with-operations.xml",
    "PncUpdateDataSet-with-operations-including-an-empty-one.xml",
    "PncUpdateDataSet-no-operations.xml",
    "PncUpdateDataSet-with-empty-operations.xml",
    "PncUpdateDataSet-unexpected-element.xml"
  ]
  inputFiles.forEach((file) => {
    const filePath = path.join(inputDirectory, file)
    it(`converts XML from file ${filePath} to PncUpdateDataSet`, () => {
      const inputXml = fs.readFileSync(filePath).toString()
      const parsedPncUpdateDatasetAho = parsePncUpdateDataSetXml(inputXml)
      const validationResult = pncUpdateDatasetSchema.safeParse(parsedPncUpdateDatasetAho)

      expect(validationResult.success).toBe(true)
      expect(parsedPncUpdateDatasetAho).toMatchSnapshot()
    })
  })

  it("Adds exceptions to a PNC Update Dataset hearing outcome", () => {
    const filePath = path.join(inputDirectory, "PncUpdateDataSet-with-result-class-error.xml")
    const inputXml = fs.readFileSync(filePath).toString()
    const parsedPncUpdateDatasetAho = parsePncUpdateDataSetXml(inputXml)
    const validationResult = pncUpdateDatasetSchema.safeParse(parsedPncUpdateDatasetAho)

    expect(validationResult.success).toBe(true)
    expect(!isError(parsedPncUpdateDatasetAho) && parsedPncUpdateDatasetAho.Exceptions).toHaveLength(1)
    expect(!isError(parsedPncUpdateDatasetAho) && parsedPncUpdateDatasetAho.Exceptions[0].code).toBe("HO200104")
  })
})
