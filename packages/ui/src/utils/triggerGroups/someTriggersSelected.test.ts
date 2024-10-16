import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type { ReasonCode } from "types/CourtCaseFilter"
import someTriggersSelected from "./someTriggersSelected"

describe("someTriggersSelected", () => {
  const triggerCodes = GroupedTriggerCodes.Bails

  it("returns false when no reasonCodes are given", () => {
    const result = someTriggersSelected(triggerCodes, [])

    expect(result).toBe(false)
  })

  it("returns false when all trigger codes are present in the reasonCodes", () => {
    const reasonCodes: ReasonCode[] = triggerCodes.map((triggerCode) => {
      return {
        value: triggerCode
      }
    })

    const result = someTriggersSelected(triggerCodes, reasonCodes)

    expect(result).toBe(false)
  })

  it("returns true when one trigger is present", () => {
    const reasonCode: ReasonCode = { value: triggerCodes[0] }

    const result = someTriggersSelected(triggerCodes, [reasonCode])

    expect(result).toBe(true)
  })

  it("returns false if a triggerCode isn't part of the group", () => {
    const reasonCode: ReasonCode = { value: TriggerCode.TRPR0001 }

    const result = someTriggersSelected(triggerCodes, [reasonCode])

    expect(result).toBe(false)
  })
})
