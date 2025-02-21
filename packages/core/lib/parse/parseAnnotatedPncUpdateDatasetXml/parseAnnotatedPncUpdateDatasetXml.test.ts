import fs from "fs"
import "jest-xml-matcher"

import { annotatedPncUpdateDatasetSchema } from "../../../schemas/annotatedPncUpdateDataset"
import parseAnnotatedPNCUpdateDatasetXml from "./parseAnnotatedPncUpdateDatasetXml"

describe("parseAnnotatedPNCUpdateDatasetXml", () => {
  it("converts XML to AnnotatedPNCUpdateDatasetXml", () => {
    const inputXml = fs.readFileSync("phase2/tests/fixtures/AnnotatedPncUpdateDataset.xml").toString()
    const parsedAnnotatedPNCUpdateDataset = parseAnnotatedPNCUpdateDatasetXml(inputXml)
    const validationResult = annotatedPncUpdateDatasetSchema.safeParse(parsedAnnotatedPNCUpdateDataset)

    expect(validationResult.success).toBe(true)
    expect(parsedAnnotatedPNCUpdateDataset).toMatchSnapshot()
  })
})
