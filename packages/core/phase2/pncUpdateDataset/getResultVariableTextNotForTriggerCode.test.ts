import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import getResultVariableTextNotForTriggerCode from "./getResultVariableTextNotForTriggerCode"

describe("getResultVariableTextNotForTriggerCode", () => {
  it("returns empty string if there is no result variable regex", () => {
    const resultVariableText = getResultVariableTextNotForTriggerCode(TriggerCode.TRPR0001)

    expect(resultVariableText).toBe("")
  })
})
