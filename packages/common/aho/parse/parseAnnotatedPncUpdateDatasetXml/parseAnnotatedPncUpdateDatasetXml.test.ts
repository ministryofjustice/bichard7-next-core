import { readFileSync } from "fs"
import "jest-xml-matcher"
import path from "path"

import { annotatedPncUpdateDatasetSchema } from "../../../schemas/annotatedPncUpdateDataset"
import parseAnnotatedPNCUpdateDatasetXml from "./parseAnnotatedPncUpdateDatasetXml"

describe("parseAnnotatedPNCUpdateDatasetXml", () => {
  it("converts XML to AnnotatedPNCUpdateDatasetXml", () => {
    const inputXml = readFileSync(path.resolve(__dirname, "../fixtures/AnnotatedPncUpdateDataset.xml")).toString()
    const parsedAnnotatedPNCUpdateDataset = parseAnnotatedPNCUpdateDatasetXml(inputXml)
    const validationResult = annotatedPncUpdateDatasetSchema.safeParse(parsedAnnotatedPNCUpdateDataset)

    expect(validationResult.success).toBe(true)
    expect(parsedAnnotatedPNCUpdateDataset).toMatchSnapshot()
  })
})
