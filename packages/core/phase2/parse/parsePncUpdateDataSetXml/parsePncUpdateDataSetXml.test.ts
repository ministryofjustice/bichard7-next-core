import fs from "fs"
import "jest-xml-matcher"
import parsePncUpdateDataSetXml from "./parsePncUpdateDataSetXml"

describe("parsePncUpdateDataSetXml", () => {
  it("converts XML to PncUpdateDataSet when operations exist", () => {
    const inputXml = fs.readFileSync("phase2/tests/fixtures/PncUpdateDataSet-with-operations.xml").toString()
    const parsedPncUpdateDatasetAho = parsePncUpdateDataSetXml(inputXml)

    expect(parsedPncUpdateDatasetAho).toMatchSnapshot()
  })

  it("converts XML to PncUpdateDataSet when no operations exist", () => {
    const inputXml = fs.readFileSync("phase2/tests/fixtures/PncUpdateDataSet-no-operations.xml").toString()
    const parsedPncUpdateDatasetAho = parsePncUpdateDataSetXml(inputXml)

    expect(parsedPncUpdateDatasetAho).toMatchSnapshot()
  })

  it("converts XML to PncUpdateDataSet when an empty operation element exists", () => {
    const inputXml = fs.readFileSync("phase2/tests/fixtures/PncUpdateDataSet-with-empty-operations.xml").toString()
    const parsedPncUpdateDatasetAho = parsePncUpdateDataSetXml(inputXml)

    expect(parsedPncUpdateDatasetAho).toMatchSnapshot()
  })

  it("converts XML to PncUpdateDataSet ignoring unexpected element", () => {
    const inputXml = fs.readFileSync("phase2/tests/fixtures/PncUpdateDataSet-unexpected-element.xml").toString()
    const parsedPncUpdateDatasetAho = parsePncUpdateDataSetXml(inputXml)

    expect(parsedPncUpdateDatasetAho).toMatchSnapshot()
  })
})
