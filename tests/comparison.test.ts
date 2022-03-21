import fs from "fs"
import CoreHandler from "../src/index"
import extractExceptionsFromAho from "./helpers/extractExceptionsFromAho"
import generateMockPncQueryResult from "./helpers/generateMockPncQueryResult"
import MockPncGateway from "./helpers/MockPncGateway"
import processTestFile from "./helpers/processTestFile"

const filePath = "test-data/e2e-comparison"

const tests = fs
  .readdirSync(filePath)
  .map((name) => `${filePath}/${name}`)
  .map(processTestFile)
  .filter((t) => !t.incomingMessage.match(/<br7:HearingOutcome/))

describe("Comparison testing", () => {
  describe.each(tests)("for test file $file", ({ incomingMessage, annotatedHearingOutcome, triggers }) => {
    try {
      const response = generateMockPncQueryResult(incomingMessage)
      const pncGateway = new MockPncGateway(response)
      const coreResult = CoreHandler(incomingMessage, true, pncGateway)
      const exceptions = extractExceptionsFromAho(annotatedHearingOutcome)

      it("should match triggers", () => {
        expect(coreResult.triggers).toStrictEqual(triggers)
      })

      it("should match exceptions", () => {
        expect(coreResult.exceptions).toStrictEqual(exceptions)
      })
    } catch (e) {
      it("should not error", () => {
        expect(e).toBeUndefined()
      })
    }
  })
})
