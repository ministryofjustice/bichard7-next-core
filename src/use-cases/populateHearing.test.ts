import { readFileSync } from "fs"
import parseMessage from "./parseMessage"
import populateHearing from "./populateHearing"

const message = readFileSync("test-data/input-message-001.xml", "utf-8")
const courtResult = parseMessage(message)

describe("populateHearing", () => {
  it("should transform SPI Hearing to Hearing Outcome Hearing", () => {
    const messageId = "DUMMY_MESSAGE_ID"
    const hearingOutcomeCase = populateHearing(messageId, courtResult)

    expect(hearingOutcomeCase).toBeDefined()
    expect(hearingOutcomeCase).toMatchSnapshot()
  })
})
