import { isError } from "lodash"

import type { DynamoAuditLog } from "../../types/AuditLog"

import { mockDynamoAuditLog } from "../../tests/helpers/mockAuditLogs"
import FakeAuditLogDynamoGateway from "../../tests/testGateways/FakeAuditLogDynamoGateway"
import FetchByHash from "./FetchByHash"

const gateway = new FakeAuditLogDynamoGateway()

it("should return all messages with the same message hash", async () => {
  const messageHash = "dummy message hash"
  const expectedMessages = [mockDynamoAuditLog({ messageHash }), mockDynamoAuditLog({ messageHash })]
  gateway.reset([...expectedMessages, mockDynamoAuditLog({ messageHash: "different hash" })])

  const messageFetcher = new FetchByHash(gateway, messageHash)
  const result = await messageFetcher.fetch()

  expect(isError(result)).toBe(false)

  const actualMessages = <DynamoAuditLog[]>result
  expect(actualMessages).toHaveLength(2)
  expect(actualMessages.map((message) => message.messageId)).toEqual(
    expectedMessages.map((expectedMessage) => expectedMessage.messageId)
  )
})

it("should return an error when fetchByHash fails", async () => {
  const expectedError = new Error("Results not found")
  gateway.shouldReturnError(expectedError)

  const messageFetcher = new FetchByHash(gateway, "Invalid hash")
  const result = await messageFetcher.fetch()

  expect(isError(result)).toBe(true)
  expect(result).toBe(expectedError)
})
