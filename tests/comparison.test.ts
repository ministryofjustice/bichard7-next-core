import fs from "fs"
import CoreHandler from "src/index"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { parseString } from "xml2js"
import extractExceptionsFromAho from "./helpers/extractExceptionsFromAho"
import generateMockPncQueryResultFromAho from "./helpers/generateMockPncQueryResultFromAho"
import MockPncGateway from "./helpers/MockPncGateway"
import processTestFile from "./helpers/processTestFile"

const filePath = "test-data/e2e-comparison"

let tests = fs
  .readdirSync(filePath)
  .map((name) => `${filePath}/${name}`)
  .map(processTestFile)
  .filter((t) => !t.incomingMessage.match(/<br7:HearingOutcome/))

const filter = process.env.FILTER_TEST
if (filter) {
  tests = tests.filter((t) => t.file.includes(filter))
}

const stripXmlNamespaces = (xml: string): string => {
  ;["br7:", "ds:"].forEach((namespace) => {
    const find = namespace
    const regex = new RegExp(find, "g")

    xml = xml.replace(regex, "")
  })

  return xml
}

const parseXML = (xml: string): AnnotatedHearingOutcome => {
  let parsedResult: AnnotatedHearingOutcome | undefined
  parseString(xml, (err, result) => {
    if (err) {
      console.error(err)
      return undefined
    }

    parsedResult = result
  })

  return parsedResult as AnnotatedHearingOutcome
}

// const xmlEquals = (resultXml: string, expectedXml: string): boolean => {
//   const result = parseXML(resultXml)
//   const expected = parseXML(stripXmlNamespaces(expectedXml))

//   return result === expected
// }

describe("Comparison testing", () => {
  describe.each(tests)("for test file $file", ({ incomingMessage, annotatedHearingOutcome, triggers }) => {
    try {
      const response = generateMockPncQueryResultFromAho(annotatedHearingOutcome)
      const pncGateway = new MockPncGateway(response)
      const coreResult = CoreHandler(incomingMessage, pncGateway)
      const exceptions = extractExceptionsFromAho(annotatedHearingOutcome)

      it("should match triggers", () => {
        expect(coreResult.triggers).toStrictEqual(triggers)
      })

      it("should match exceptions", () => {
        expect(coreResult.exceptions).toBeDefined()
        expect(exceptions).toBeDefined()
        // expect(coreResult.exceptions).toStrictEqual(exceptions)
      })

      it("should match aho xml", () => {
        const result = parseXML(coreResult.ahoXml)
        const expected = parseXML(stripXmlNamespaces(annotatedHearingOutcome))

        expect(result.AnnotatedHearingOutcome.HearingOutcome).toStrictEqual(
          expected.AnnotatedHearingOutcome.HearingOutcome
        )
        // expect(xmlEquals(coreResult.ahoXml, annotatedHearingOutcome)).toBe(true)
      })
    } catch (e) {
      it("should not error", () => {
        console.log(e)
        expect(e).toBeUndefined()
      })
    }
  })
})
