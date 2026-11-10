import fs from "node:fs"
import type { ResultCode } from "@moj-bichard7/standing-data/types/types"
import { convertCjsResultCodes } from "./convertCjsResultCodes"
import { readFile } from "../lib/readFile"

describe("convertResultCodes", () => {
  it("converts XLSX buffer into ResultCode[]", async () => {
    const fileContent = fs.readFileSync("./test-data/input/cjs-result-codes.xlsx")

    const convertedCjsResultCodes = convertCjsResultCodes(fileContent)
    const expectedCjsResultCodes = await readFile<ResultCode[]>("../../test-data/expected-output/cjs-result-codes.json")

    expect(convertedCjsResultCodes).toEqual(expectedCjsResultCodes)
  })

  it("handles missing fields gracefully", async () => {
    const fileContent = fs.readFileSync("./test-data/input/cjs-result-codes-missing-fields.xlsx")

    const convertedCjsResultCodes = convertCjsResultCodes(fileContent)
    const expectedResultCodesMissingFields = await readFile<ResultCode[]>(
      "../../test-data/expected-output/cjs-result-codes-missing-fields.json"
    )

    expect(convertedCjsResultCodes).toEqual(expectedResultCodesMissingFields)
  })

  it("throws an error when given an invalid XLSX buffer", () => {
    const badBuffer = Buffer.from("not an xlsx file")

    expect(() => convertCjsResultCodes(badBuffer)).toThrow("Invalid XLSX file")
  })
})
