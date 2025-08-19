import { readFileSync } from "fs"
import path from "path"

import parseSpiResult from "../parseSpiResult"
import populateHearing from "./populateHearing"

const message = readFileSync(path.resolve(__dirname, "../fixtures/input-message-001.xml"), "utf-8")
const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage

describe("populateHearing", () => {
  it("should transform SPI Hearing to Hearing Outcome Hearing", () => {
    const messageId = "DUMMY_MESSAGE_ID"
    const hearingOutcomeCase = populateHearing(messageId, courtResult)

    expect(hearingOutcomeCase).toBeDefined()
    expect(hearingOutcomeCase).toMatchSnapshot()
  })
})
