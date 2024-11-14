import type { DisplayFullUser } from "types/display/Users"
import allExcludedTriggers from "./allExcludedTriggers"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

describe("allExcludedTriggers", () => {
  const testUser = {
    excludedTriggers: [TriggerCode.TRPR0001],
    visibleForces: ["001"]
  } as unknown as DisplayFullUser

  it("Returns an array containing both user and force excluded triggers", () => {
    const forceExcludedTriggers = { "01": [TriggerCode.TRPR0002, TriggerCode.TRPR0003] }

    const excludedTriggers = allExcludedTriggers(testUser, forceExcludedTriggers)

    expect(excludedTriggers).toHaveLength(3)
    expect(excludedTriggers).toContain(TriggerCode.TRPR0001)
    expect(excludedTriggers).toContain(TriggerCode.TRPR0002)
    expect(excludedTriggers).toContain(TriggerCode.TRPR0003)
  })

  it("Returns array with only user excluded triggers when non of the triggers are excluded on force level", () => {
    const forceExcludedTriggers = { "01": [] }

    const excludedTriggers = allExcludedTriggers(testUser, forceExcludedTriggers)

    expect(excludedTriggers).toHaveLength(1)
    expect(excludedTriggers).toContain(TriggerCode.TRPR0001)
  })

  it("Returns array with only force excluded triggers when non of the triggers are excluded on user level", () => {
    const testUserWihoutExcludedTriggers = {
      excludedTriggers: [],
      visibleForces: ["001"]
    } as unknown as DisplayFullUser
    const forceExcludedTriggers = { "01": [TriggerCode.TRPR0001, TriggerCode.TRPR0002] }

    const excludedTriggers = allExcludedTriggers(testUserWihoutExcludedTriggers, forceExcludedTriggers)

    expect(excludedTriggers).toHaveLength(2)
    expect(excludedTriggers).toContain(TriggerCode.TRPR0001)
    expect(excludedTriggers).toContain(TriggerCode.TRPR0002)
  })

  it("Returns an array without duplicate triggers when user and force excluded triggers are common", () => {
    const forceExcludedTriggers = { "01": [TriggerCode.TRPR0001, TriggerCode.TRPR0002] }

    const excludedTriggers = allExcludedTriggers(testUser, forceExcludedTriggers)

    expect(excludedTriggers).toHaveLength(2)
    expect(excludedTriggers).toContain(TriggerCode.TRPR0001)
    expect(excludedTriggers).toContain(TriggerCode.TRPR0002)
  })
})
