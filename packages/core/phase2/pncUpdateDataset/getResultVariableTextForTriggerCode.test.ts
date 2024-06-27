import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import getResultVariableTextForTriggerCode from "./getResultVariableTextForTriggerCode"

describe("getResultVariableTextForTriggerCode", () => {
  it("returns empty string if there is no result variable regex", () => {
    const resultVariableText = getResultVariableTextForTriggerCode(TriggerCode.TRPR0001)

    expect(resultVariableText).toBe("")
  })
})
