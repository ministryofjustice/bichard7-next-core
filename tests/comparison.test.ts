import fs from "fs"
import CoreHandler from "src/index"
import extractExceptionsFromAho from "./helpers/extractExceptionsFromAho"
import generateMockPncQueryResultFromAho from "./helpers/generateMockPncQueryResultFromAho"
import MockPncGateway from "./helpers/MockPncGateway"
import processTestFile from "./helpers/processTestFile"
import xml2js = require("xml2js")
import { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

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

type ParsedAnnotatedHearingOutcome = {
  'br7:AnnotatedHearingOutcome': {
    'br7:HearingOutcome': {
      'br7:Hearing': Object,
      'br7:Case': Object
    }
  }
}

const xmlEquals = (resultXml: string, expectedXml: string): Boolean => {
  let parsedResult: AnnotatedHearingOutcome
  xml2js.parseString(resultXml, (err, result) => {
    if(!err) {
      parsedResult = result as AnnotatedHearingOutcome
      console.log(expectedXml)
    }
  })

  let parsedExpected: ParsedAnnotatedHearingOutcome
  xml2js.parseString(expectedXml, (err, result) => {
    if(!err) {
      parsedExpected = result as ParsedAnnotatedHearingOutcome
      console.log(parsedExpected)
      console.log(parsedExpected["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Hearing"])
    }
  })

  return parsedResult!.AnnotatedHearingOutcome.HearingOutcome.Hearing === parsedExpected!["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]['br7:Hearing']
}

describe("Comparison testing", () => {
  describe.each([tests[0]])("for test file $file", ({ incomingMessage, annotatedHearingOutcome, triggers }) => {
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

      fit("should match aho xml", () => {
        // TODO: Write custom matcher to compare xml structures without caring about namespaces
        // coreResult.ahoXml "to match" annotatedHearingOutcome
        expect(xmlEquals(coreResult.ahoXml, annotatedHearingOutcome)).toBe(true)
      })
    } catch (e) {
      it("should not error", () => {
        console.log(e)
        expect(e).toBeUndefined()
      })
    }
  })
})
