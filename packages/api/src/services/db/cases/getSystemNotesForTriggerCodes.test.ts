import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import getSystemNotesForTriggerCodes from "./getSystemNotesForTriggerCodes"

describe("getSystemNotesForTriggerCodes", () => {
  const resolver = "username"

  it("returns empty array when given empty triggers", () => {
    const result = getSystemNotesForTriggerCodes([], resolver)

    expect(result).toEqual([])
  })

  it("contains the resolver variable in the note", () => {
    const triggerCodes = [TriggerCode.TRPR0001]

    const result = getSystemNotesForTriggerCodes(triggerCodes, resolver)

    expect(result).toContain(`${resolver}: Portal Action: Resolved Trigger. Code: PR01`)
  })

  it("contains the short trigger code in the note", () => {
    const triggerCodes = [TriggerCode.TRPR0001]
    const shortTriggerCode = "PR01"

    const result = getSystemNotesForTriggerCodes(triggerCodes, resolver)

    expect(result).toContain(`${resolver}: Portal Action: Resolved Trigger. Code: ${shortTriggerCode}`)
  })

  it("can handle multiple triggers", () => {
    const triggerCodes = [TriggerCode.TRPR0001, TriggerCode.TRPR0002, TriggerCode.TRPR0003]

    const result = getSystemNotesForTriggerCodes(triggerCodes, resolver)

    expect(result).toEqual([
      "username: Portal Action: Resolved Trigger. Code: PR01",
      "username: Portal Action: Resolved Trigger. Code: PR02",
      "username: Portal Action: Resolved Trigger. Code: PR03"
    ])
  })
})
