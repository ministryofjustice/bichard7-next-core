import { TriggerCode } from "../../types/TriggerCode"
import getResultVariableTextNotForTriggerCode from "./getResultVariableTextNotForTriggerCode"

describe("getResultVariableTextNotForTriggerCode", () => {
  it("returns a result variable regex", () => {
    const resultVariableText = getResultVariableTextNotForTriggerCode(TriggerCode.TRPS0001)

    expect(resultVariableText).toBe("until further order,until (0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/(19|20)\\d\\d")
  })

  it("returns empty string if there is no result variable regex", () => {
    const resultVariableText = getResultVariableTextNotForTriggerCode(TriggerCode.TRPR0001)

    expect(resultVariableText).toBe("")
  })
})
