import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getShortTriggerCode from "@moj-bichard7/common/utils/getShortTriggerCode"
import Trigger from "services/entities/Trigger"
import getSystemNotesForTriggers from "./getSystemNotesForTriggers"

describe("getSystemNotesForTriggers", () => {
  const dummyErrorId = 0
  const resolver = "username"
  const userId = "System"

  it("returns empty array when given empty triggers", () => {
    const result = getSystemNotesForTriggers([], resolver, dummyErrorId)

    expect(result).toEqual([])
  })

  it("contains the resolver variable in the note", () => {
    const trigger = new Trigger()
    trigger.triggerCode = TriggerCode.TRPR0001
    trigger.shortTriggerCode = "PR01"
    const result = getSystemNotesForTriggers([trigger], resolver, dummyErrorId)

    expect(result).toEqual([
      { errorId: 0, noteText: `${resolver}: Portal Action: Resolved Trigger. Code: PR01`, userId: "System" }
    ])
  })

  it("contains the short trigger code in the note", () => {
    const shortTriggerCode = "PR01"
    const trigger = new Trigger()
    trigger.triggerCode = TriggerCode.TRPR0001
    trigger.shortTriggerCode = shortTriggerCode
    const result = getSystemNotesForTriggers([trigger], resolver, dummyErrorId)

    expect(result).toEqual([
      { errorId: 0, noteText: `username: Portal Action: Resolved Trigger. Code: ${shortTriggerCode}`, userId: "System" }
    ])
  })

  it("contains the system user in the note", () => {
    const trigger = new Trigger()
    trigger.triggerCode = TriggerCode.TRPR0001
    trigger.shortTriggerCode = "PR01"
    const result = getSystemNotesForTriggers([trigger], resolver, dummyErrorId)

    expect(result).toEqual([
      { errorId: 0, noteText: "username: Portal Action: Resolved Trigger. Code: PR01", userId: userId }
    ])
  })

  it("can handle multiple triggers", () => {
    const triggers = [TriggerCode.TRPR0001, TriggerCode.TRPR0002, TriggerCode.TRPR0003].map((triggerCode) => {
      const trigger = new Trigger()
      trigger.triggerCode = triggerCode
      trigger.shortTriggerCode = getShortTriggerCode(triggerCode)

      return trigger
    })

    const result = getSystemNotesForTriggers(triggers, resolver, dummyErrorId)

    expect(result).toEqual([
      { errorId: 0, noteText: "username: Portal Action: Resolved Trigger. Code: PR01", userId: userId },
      { errorId: 0, noteText: "username: Portal Action: Resolved Trigger. Code: PR02", userId: userId },
      { errorId: 0, noteText: "username: Portal Action: Resolved Trigger. Code: PR03", userId: userId }
    ])
  })
})
