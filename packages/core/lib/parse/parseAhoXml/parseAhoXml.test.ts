import fs from "fs"
import "jest-xml-matcher"

import { unvalidatedHearingOutcomeSchema } from "../../../schemas/unvalidatedHearingOutcome"
import parseAhoXml from "./parseAhoXml"

describe("parseAhoXml", () => {
  it.each(["AnnotatedHO1", "AnnotatedHO2"])("converts %s XML to Aho", (inputFilename) => {
    const inputXml = fs.readFileSync(`phase1/tests/fixtures/${inputFilename}.xml`).toString()
    const parsedAho = parseAhoXml(inputXml)
    const validationResult = unvalidatedHearingOutcomeSchema.safeParse(parsedAho)

    expect(validationResult.success).toBe(true)
    expect(parsedAho).toMatchSnapshot()
  })
})
