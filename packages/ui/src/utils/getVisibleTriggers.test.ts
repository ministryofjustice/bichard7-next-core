import getVisibleTriggers from "./getVisibleTriggers"
import type { DisplayFullUser } from "../types/display/Users"
import type { TriggerDefinition } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

describe("getVisibleTriggers", () => {
  const triggerDefinitions: TriggerDefinition[] = [
    { code: TriggerCode.TRPR0001, description: "", shortDescription: "" },
    { code: TriggerCode.TRPR0002, description: "", shortDescription: "" },
    { code: TriggerCode.TRPR0003, description: "", shortDescription: "" },
    { code: TriggerCode.TRPR0004, description: "", shortDescription: "" }
  ]

  const forceExcludedTriggers = {
    ["01"]: ["TRPR0002"]
  }

  it("should return all triggers as none are excluded", () => {
    const testUser = {
      excludedTriggers: [],
      visibleForces: []
    } as unknown as DisplayFullUser

    const visibleTriggers = getVisibleTriggers(testUser, triggerDefinitions, forceExcludedTriggers)

    expect(visibleTriggers).toEqual(["TRPR0001", "TRPR0002", "TRPR0003", "TRPR0004"])
  })

  it("should remove excluded triggers", () => {
    const testUser = {
      excludedTriggers: ["TRPR0003"],
      visibleForces: ["001"]
    } as unknown as DisplayFullUser

    const visibleTriggers = getVisibleTriggers(testUser, triggerDefinitions, forceExcludedTriggers)

    expect(visibleTriggers).toEqual(["TRPR0001", "TRPR0004"])
  })
})
