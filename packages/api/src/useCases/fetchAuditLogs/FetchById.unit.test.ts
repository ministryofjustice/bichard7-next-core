import { isError } from "lodash"

import type { DynamoAuditLog } from "../../types/AuditLog"

import { mockDynamoAuditLog } from "../../tests/helpers/mockAuditLogs"
import FakeAuditLogDynamoGateway from "../../tests/testGateways/FakeAuditLogDynamoGateway"
import FetchById from "./FetchById"

const gateway = new FakeAuditLogDynamoGateway()

it("should return one message when messageId exists", async () => {
  const expectedMessage = mockDynamoAuditLog()
  gateway.reset([expectedMessage])

  const messageFetcher = new FetchById(gateway, expectedMessage.messageId)
  const result = await messageFetcher.fetch()

  expect(isError(result)).toBe(false)

  const actualMessage = <DynamoAuditLog>result
  expect(actualMessage.messageId).toBe(expectedMessage.messageId)
})

it("should return an error when fetchOne fails", async () => {
  const expectedError = new Error("Results not found")
  gateway.shouldReturnError(expectedError)

  const messageFetcher = new FetchById(gateway, "Invalid id")
  const result = await messageFetcher.fetch()

  expect(isError(result)).toBe(true)
  expect(result).toBe(expectedError)
})
