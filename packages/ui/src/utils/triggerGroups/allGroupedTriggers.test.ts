import TriggerCode, { TriggerCodeGroups } from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import allGroupedTriggers from "./allGroupedTriggers"

describe("allGroupedTriggers", () => {
  const excludedTriggers: TriggerCode[] = [TriggerCode.TRPR0001]
  it("can take an enum value from TriggerCodeGroups to find a group of Triggers", () => {
    const result = allGroupedTriggers(TriggerCodeGroups.Bails, excludedTriggers)

    expect(result).toHaveLength(4)
  })

  it("can take a string key to find a group of Triggers", () => {
    const result = allGroupedTriggers("Bails", excludedTriggers)

    expect(result).toHaveLength(4)
  })

  it("needs to be a case sensitive key string or it returns undefined", () => {
    const result = allGroupedTriggers("bails", excludedTriggers)

    expect(result).toBeUndefined()
  })

  it("will return undefined if the group doesn't exist", () => {
    const result = allGroupedTriggers("other", excludedTriggers)

    expect(result).toBeUndefined()
  })

  it("removes excluded triggers from the groupedTriggers", () => {
    const result = allGroupedTriggers(TriggerCodeGroups.Custody, excludedTriggers)

    expect(result).toHaveLength(4)
    expect(result).not.toContain(TriggerCode.TRPR0001)
  })
})
