import { TriggerCode } from "../../types/TriggerCode"
import getResultVariableTextForTriggerCode from "./getResultVariableTextForTriggerCode"

describe("getResultVariableTextForTriggerCode", () => {
  it("returns a result variable regex", () => {
    const resultVariableText = getResultVariableTextForTriggerCode(TriggerCode.TRPS0001)

    expect(resultVariableText).toBe("Restraining order made that the defendant must")
  })

  it("returns empty string if there is no result variable regex", () => {
    const resultVariableText = getResultVariableTextForTriggerCode(TriggerCode.TRPR0001)

    expect(resultVariableText).toBe("")
  })
})
