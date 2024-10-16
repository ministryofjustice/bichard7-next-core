import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type { ReasonCode } from "types/CourtCaseFilter"
import allTriggersSelected from "./allTriggersSelected"

describe("allTriggersSelected", () => {
  const triggerCodes = GroupedTriggerCodes.Bails

  it("returns false when reasonCodes is an empty array", () => {
    const result = allTriggersSelected(triggerCodes, [])

    expect(result).toBe(false)
  })

  it("returns false when reasonCodes only has one value", () => {
    const reasonCodes: ReasonCode[] = [{ value: triggerCodes[0] }]

    const result = allTriggersSelected(triggerCodes, reasonCodes)

    expect(result).toBe(false)
  })

  it("returns true when all the reasonCodes match the group of triggers", () => {
    const reasonCodes: ReasonCode[] = triggerCodes.map((triggerCode) => {
      return {
        value: triggerCode
      }
    })

    const result = allTriggersSelected(triggerCodes, reasonCodes)

    expect(result).toBe(true)
  })

  it("returns false when reasonCodes has too many values", () => {
    const reasonCodes: ReasonCode[] = triggerCodes.map((triggerCode) => {
      return {
        value: triggerCode
      }
    })
    reasonCodes.push({ value: TriggerCode.TRPR0001 })

    const result = allTriggersSelected(triggerCodes, reasonCodes)

    expect(result).toBe(false)
  })
})
