import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import isResultVariableTextForTriggerMatch from "./isResultVariableTextForTriggerMatch"

describe("isResultVariableTextForTriggerMatch", () => {
  it("returns true if result variable text matches trigger code text pattern", () => {
    const variableText = "sex offender,sex offenses act"
    expect(isResultVariableTextForTriggerMatch(TriggerCode.TRPR0004, variableText)).toBeTruthy()
  })
})
