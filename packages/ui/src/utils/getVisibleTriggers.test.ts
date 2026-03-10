import getVisibleTriggers from "./getVisibleTriggers"
import type { DisplayFullUser } from "../types/display/Users"
import { triggerDefinitions } from "@moj-bichard7-developers/bichard7-next-data/dist"

describe("getVisibleTriggers", () => {
  it("should return all triggers as non are excluded", () => {
    const testUser = {
      excludedTriggers: [],
      visibleForces: []
    } as unknown as DisplayFullUser

    const visibleTriggers = getVisibleTriggers(testUser)

    expect(visibleTriggers).toEqual(triggerDefinitions.map((t) => t.code))
  })

  it("should remove excluded triggers", () => {
    const testUser = {
      excludedTriggers: ["TRPR0010"],
      visibleForces: ["001"]
    } as unknown as DisplayFullUser

    const visibleTriggers = getVisibleTriggers(testUser)

    expect(visibleTriggers).not.toContain("TRPR0010")
    expect(visibleTriggers).not.toContain("TRPR0005") // Excluded by force "01"
  })
})
