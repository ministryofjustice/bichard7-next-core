import { TriggerCodeGroups } from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import allGroupedTriggers from "./allGroupedTriggers"

describe("allGroupedTriggers", () => {
  it("can take an enum value from TriggerCodeGroups to find a group of Triggers", () => {
    const result = allGroupedTriggers(TriggerCodeGroups.Bails)

    expect(result.length).toBe(4)
  })

  it("can take a string key to find a group of Triggers", () => {
    const result = allGroupedTriggers("Bails")

    expect(result.length).toBe(4)
  })

  it("needs to be a case sensitive key string or it returns undefined", () => {
    const result = allGroupedTriggers("bails")

    expect(result).toBeUndefined()
  })

  it("will return undefined if the group doesn't exist", () => {
    const result = allGroupedTriggers("other")

    expect(result).toBeUndefined()
  })
})
