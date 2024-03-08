import fs from "fs"
import type { TransformedOutput } from "./transformIncomingMessageToAho"
import transformIncomingMessageToAho from "./transformIncomingMessageToAho"

describe("transformIncomingMessageToAho", () => {
  it("should transform the incoming message to an AHO", () => {
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-001.xml"))

    const output = transformIncomingMessageToAho(inputMessage)

    expect(output).toMatchSnapshot()
  })

  it("should decode '&' xml entities in the incoming message correctly", () => {
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-entities.xml"))

    const output = transformIncomingMessageToAho(inputMessage) as TransformedOutput

    expect(output.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].LocationOfOffence).toBe(
      "Elephant & Castle"
    )
  })

  it("should decode double escaped '&amp;lt;' xml entities in the incoming message correctly", () => {
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-double-entities.xml"))

    const output = transformIncomingMessageToAho(inputMessage) as TransformedOutput

    expect(
      output.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].ActualOffenceWording
    ).toBe("Something < 240 grams")
    expect(
      output.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[2].Result[0].ResultVariableText
    ).toBe("emailed to <test@test.com>")
  })
})
