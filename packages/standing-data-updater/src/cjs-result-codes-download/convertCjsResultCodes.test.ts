import fs from "fs"
import convertCjsResultCodes from "./convertCjsResultCodes"
import expectedCjsResultCodes from "../../test-data/expected-output/cjs-result-codes.json"
import expectedResultCodesMissingFields from "../../test-data/expected-output/cjs-result-codes-missing-fields.json"

describe("convertResultCodes", () => {
  it("converts XLSX buffer into ResultCode[]", () => {
    const fileContent = fs.readFileSync("./test-data/input/cjs-result-codes.xlsx")

    const convertedCjsResultCodes = convertCjsResultCodes(fileContent)

    expect(convertedCjsResultCodes).toEqual(expectedCjsResultCodes)
  })

  it("handles missing fields gracefully", () => {
    const fileContent = fs.readFileSync("./test-data/input/cjs-result-codes-missing-fields.xlsx")

    const convertedCjsResultCodes = convertCjsResultCodes(fileContent)

    expect(convertedCjsResultCodes).toEqual(expectedResultCodesMissingFields)
  })

  it("throws an error when given an invalid XLSX buffer", () => {
    const badBuffer = Buffer.from("not an xlsx file")

    expect(() => convertCjsResultCodes(badBuffer)).toThrow("Invalid XLSX file")
  })
})
