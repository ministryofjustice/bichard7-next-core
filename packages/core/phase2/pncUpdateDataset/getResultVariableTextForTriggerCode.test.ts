import { TriggerCode } from "../../types/TriggerCode"
import getResultVariableTextForTriggerCode from "./getResultVariableTextForTriggerCode"

describe("getResultVariableTextForTriggerCode", () => {
  it("returns a result variable string", () => {
    const resultVariableTexts = getResultVariableTextForTriggerCode(TriggerCode.TRPS0001)

    expect(resultVariableTexts).toBe("Restraining order made that the defendant must")
  })

  it("returns an empty string if there is no result variable text", () => {
    const resultVariableTexts = getResultVariableTextForTriggerCode(TriggerCode.TRPR0001)

    expect(resultVariableTexts).toBe("")
  })
})
