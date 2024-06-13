import { TriggerCode } from "../../types/TriggerCode"
import isResultVariableTextNotForTriggerMatch from "./isResultVariableTextNotForTriggerMatch"

describe("isResultVariableTextNotForTriggerMatch", () => {
  it("returns false if result variable text not a match for trigger code exception", () => {
    expect(isResultVariableTextNotForTriggerMatch("TRPS0001" as TriggerCode, "result-variable-code")).toBeFalsy()
  })

  it("returns true if result variable text matches trigger code exception", () => {
    const variableText = "until further order,until 01/01/2020"
    expect(isResultVariableTextNotForTriggerMatch(TriggerCode.TRPR0004, variableText)).toBeTruthy()
  })
})
