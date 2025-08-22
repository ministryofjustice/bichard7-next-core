import fs from "fs"
import "jest-xml-matcher"
import path from "path"

import { unvalidatedHearingOutcomeSchema } from "../../schemas/unvalidatedHearingOutcome"
import parseAhoXml from "./parseAhoXml"

describe("parseAhoXml", () => {
  it.each(["AnnotatedHO1", "AnnotatedHO2"])("converts %s XML to Aho", (inputFilename) => {
    const inputXml = fs.readFileSync(path.resolve(__dirname, `./fixtures/${inputFilename}.xml`), "utf-8")
    const parsedAho = parseAhoXml(inputXml)
    const validationResult = unvalidatedHearingOutcomeSchema.safeParse(parsedAho)

    expect(validationResult.success).toBe(true)
    expect(parsedAho).toMatchSnapshot()
  })
})
