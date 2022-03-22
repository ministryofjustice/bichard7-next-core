import fs from "fs"
import CoreHandler from "../src/index"
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
        // expect(coreResult.exceptions).toBeDefined()
        // expect(exceptions).toBeDefined()
        expect(coreResult.exceptions).toStrictEqual(exceptions)
      })
    } catch (e) {
      it("should not error", () => {
        console.log(e)
        expect(e).toBeUndefined()
      })
    }
  })
})
