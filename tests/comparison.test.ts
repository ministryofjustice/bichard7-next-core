import fs from "fs"
import "jest-xml-matcher"
import orderBy from "lodash.orderby"
import CoreHandler from "src/index"
import { parseAhoXml } from "src/parse/parseAhoXml"
import extractExceptionsFromAho from "src/parse/parseAhoXml/extractExceptionsFromAho"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type Exception from "src/types/Exception"
import generateMockPncQueryResultFromAho from "./helpers/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "./helpers/getPncQueryTimeFromAho"
import MockPncGateway from "./helpers/MockPncGateway"
import processTestFile from "./helpers/processTestFile"

const filePath = "test-data/e2e-comparison"

let tests = fs
  .readdirSync(filePath)
  .map((name) => `${filePath}/${name}`)
  .map(processTestFile)

const filter = process.env.FILTER_TEST
if (filter) {
  tests = tests.filter((t) => t.file && t.file.includes(filter))
}

const sortExceptions = (exceptions: Exception[]): Exception[] => orderBy(exceptions, ["code", "path"])

describe("Comparison testing", () => {
  describe.each(tests)("for test file $file", ({ incomingMessage, annotatedHearingOutcome, triggers }) => {
    describe("processing spi messages", () => {
      try {
        const response = generateMockPncQueryResultFromAho(annotatedHearingOutcome)
        const pncQueryTime = getPncQueryTimeFromAho(annotatedHearingOutcome)
        const pncGateway = new MockPncGateway(response, pncQueryTime)
        const coreResult = CoreHandler(incomingMessage, pncGateway)
        const exceptions = sortExceptions(extractExceptionsFromAho(annotatedHearingOutcome))

        it("should match triggers", () => {
          expect(coreResult.triggers).toStrictEqual(triggers)
        })

        it("should match exceptions", () => {
          const coreExceptions = sortExceptions(coreResult.hearingOutcome.Exceptions ?? [])
          expect(coreResult.hearingOutcome.Exceptions).toBeDefined()
          expect(exceptions).toBeDefined()
          expect(coreExceptions).toStrictEqual(exceptions)
        })

        it("should match aho xml", () => {
          const ahoXml = convertAhoToXml(coreResult.hearingOutcome)
          expect(ahoXml).toEqualXML(annotatedHearingOutcome)
        })

        it("should correctly parse aho xml", () => {
          const parsedAho = parseAhoXml(annotatedHearingOutcome)
          if (parsedAho instanceof Error) {
            throw parsedAho
          }
          const ahoXml = convertAhoToXml(parsedAho)
          expect(ahoXml).toEqualXML(annotatedHearingOutcome)
        })

        it("should fully match", () => {
          expect(coreResult.triggers).toStrictEqual(triggers)
          const coreExceptions = sortExceptions(coreResult.hearingOutcome.Exceptions ?? [])
          expect(coreExceptions).toStrictEqual(exceptions)
          const ahoXml = convertAhoToXml(coreResult.hearingOutcome)
          expect(ahoXml).toEqualXML(annotatedHearingOutcome)
          const parsedAho = parseAhoXml(annotatedHearingOutcome)
          if (parsedAho instanceof Error) {
            throw parsedAho
          }
          const parsedAhoXml = convertAhoToXml(parsedAho)
          expect(parsedAhoXml).toEqualXML(annotatedHearingOutcome)
        })
      } catch (e) {
        it("should not error", () => {
          console.log(e)
          expect(e).toBeUndefined()
        })
      }
    })
  })
})
