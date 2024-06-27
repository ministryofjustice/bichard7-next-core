import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import isResultVariableTextNotForTriggerMatch from "./isResultVariableTextNotForTriggerMatch"

describe("isResultVariableTextNotForTriggerMatch", () => {
  it("returns true if result variable text matches trigger code exception", () => {
    const variableText = "until further order,until 01/01/2020"
    expect(isResultVariableTextNotForTriggerMatch(TriggerCode.TRPR0004, variableText)).toBeTruthy()
  })
})
