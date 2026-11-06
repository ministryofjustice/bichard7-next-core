import fs from "fs"
import convertOffenceDataXls from "./convertOffenceDataXls"

const expectedCCJSOffenceCodesFile = "test-data/expected-output/pnc-ccjs-expected.json"

describe("convertOffenceDataXls", () => {
  it("should convert PNC CCJS file", () => {
    const expectedOffenceCodes = JSON.parse(fs.readFileSync(expectedCCJSOffenceCodesFile).toString())
    const fileContents = fs.readFileSync("./test-data/input/INC275907.NPOFFP.CCJS.xlsx")
    const offenceCodes = convertOffenceDataXls(Buffer.from(fileContents))

    expect(offenceCodes).toHaveLength(expectedOffenceCodes.length)
  })
})
