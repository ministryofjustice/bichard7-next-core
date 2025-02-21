import EventCode from "@moj-bichard7/common/types/EventCode"

import type { DynamoAuditLogEvent } from "../../types/AuditLogEvent"

import calculateRetryCount from "./calculateRetryCount"

const retryEvent = (): DynamoAuditLogEvent => {
  return {
    attributes: {},
    eventCode: EventCode.RetryingMessage
  } as unknown as DynamoAuditLogEvent
}

const nonRetryEvent = (): DynamoAuditLogEvent => {
  return {
    attributes: {},
    eventType: "Something else"
  } as unknown as DynamoAuditLogEvent
}

describe("calculateRetryCount", () => {
  it("should set sanitised status when a retry event is added", () => {
    const events = [nonRetryEvent(), nonRetryEvent(), retryEvent(), nonRetryEvent()]
    const forceOwnerDynamoUpdates = calculateRetryCount(events)
    expect(forceOwnerDynamoUpdates).toStrictEqual({ retryCount: 1 })
  })

  it("should increase the count by the correct amount when many retry events are added", () => {
    const events = [nonRetryEvent(), nonRetryEvent(), retryEvent(), nonRetryEvent(), retryEvent(), retryEvent()]
    const forceOwnerDynamoUpdates = calculateRetryCount(events)
    expect(forceOwnerDynamoUpdates).toStrictEqual({ retryCount: 3 })
  })

  it("shouldn't change anything in dynamodb when there are no retry events", () => {
    const events = [nonRetryEvent(), nonRetryEvent(), nonRetryEvent()]
    const forceOwnerDynamoUpdates = calculateRetryCount(events)
    expect(forceOwnerDynamoUpdates).toStrictEqual({})
  })
})
