import { TriggerCode } from "../../types/TriggerCode"
import isResultVariableTextForTriggerMatch from "./isResultVariableTextForTriggerMatch"

describe("isResultVariableTextForTriggerMatch", () => {
  it("returns false if result variable text not a match for trigger code text pattern", () => {
    expect(isResultVariableTextForTriggerMatch("TRPS0001" as TriggerCode, "result-variable-code")).toBeFalsy()
  })

  it("returns true if result variable text matches trigger code text pattern", () => {
    const variableText = "sex offender,sex offenses act"
    expect(isResultVariableTextForTriggerMatch(TriggerCode.TRPR0004, variableText)).toBeTruthy()
  })
})
