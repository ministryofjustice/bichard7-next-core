import { TriggerCode } from "../../types/TriggerCode"
import isResultVariableTextForTriggerMatch from "./isResultVariableTextForTriggerMatch"

describe("isResultVariableTextForTriggerMatch", () => {
  it("returns false if result variable text not a match for trigger code text pattern", () => {
    expect(isResultVariableTextForTriggerMatch(TriggerCode.TRPR0001, "result-variable-code")).toBeFalsy()
  })
})
