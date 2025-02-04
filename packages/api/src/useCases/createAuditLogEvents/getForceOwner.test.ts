import EventCode from "@moj-bichard7/common/types/EventCode"

import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import getForceOwner from "./getForceOwner"

it("should return the force owner when message type is correct", () => {
  const event = {
    attributes: {
      "Force Owner": "010000"
    },
    eventCode: EventCode.HearingOutcomeDetails
  } as unknown as ApiAuditLogEvent

  const result = getForceOwner(event)

  expect(result).toBe(1)
})

it("should return the force owner for the correct V2 message type", () => {
  const event = {
    attributes: {
      "Force Owner": "010000"
    },
    eventCode: EventCode.HearingOutcomeDetails
  } as unknown as ApiAuditLogEvent

  const result = getForceOwner(event)

  expect(result).toBe(1)
})

it("should return undefined when message type is incorrect", () => {
  const event = {
    attributes: {
      "Force Owner": "010000"
    },
    eventType: "Incorrect message type"
  } as unknown as ApiAuditLogEvent

  const result = getForceOwner(event)

  expect(result).toBeUndefined()
})
