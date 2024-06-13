import { TriggerCode } from "../../types/TriggerCode"
import getGenericTriggerCaseOrOffenceLevelIndicator from "./getGenericTriggerCaseOrOffenceLevelIndicator"

describe("getGenericTriggerCaseOrOffenceLevelIndicator", () => {
  it("should return an empty string", () => {
    const result = getGenericTriggerCaseOrOffenceLevelIndicator("TR000001" as TriggerCode)

    expect(result).toEqual("")
  })
})
