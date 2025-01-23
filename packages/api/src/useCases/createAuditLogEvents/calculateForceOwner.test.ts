import type { DynamoAuditLogEvent } from "../../types/AuditLogEvent"

import EventCode from "../../types/EventCode"
import calculateForceOwner from "./calculateForceOwner"

const forceOwnerChangeEvent = (): DynamoAuditLogEvent => {
  return {
    attributes: {
      "Force Owner": "010000"
    },
    eventCode: EventCode.HearingOutcomeDetails,
    timestamp: Date.now()
  } as unknown as DynamoAuditLogEvent
}

const nonForceOwnerChangeEvent = (): DynamoAuditLogEvent => {
  return {
    attributes: {},
    eventType: "Something else",
    timestamp: Date.now()
  } as unknown as DynamoAuditLogEvent
}

describe("calculateForceOwner", () => {
  it("should give the correct force owner when it changes", () => {
    const events = [
      nonForceOwnerChangeEvent(),
      nonForceOwnerChangeEvent(),
      forceOwnerChangeEvent(),
      nonForceOwnerChangeEvent()
    ]
    const forceOwner = calculateForceOwner(events)
    expect(forceOwner).toStrictEqual({ forceOwner: 1 })
  })

  it("shouldn't change anything in dynamodb when the force owner doesn't change", () => {
    const events = [nonForceOwnerChangeEvent(), nonForceOwnerChangeEvent(), nonForceOwnerChangeEvent()]
    const forceOwner = calculateForceOwner(events)
    expect(forceOwner).toStrictEqual({})
  })
})
