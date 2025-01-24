import AuditLogStatus from "@moj-bichard7/common/types/AuditLogStatus"
import { isError } from "lodash"

import type { DynamoAuditLog } from "../../types/AuditLog"

import { mockDynamoAuditLog } from "../../tests/helpers/mockAuditLogs"
import FakeAuditLogDynamoGateway from "../../tests/testGateways/FakeAuditLogDynamoGateway"
import FetchByStatus from "./FetchByStatus"

const gateway = new FakeAuditLogDynamoGateway()

it("should return one message when there is a message with the specified status", async () => {
  const expectedStatus = AuditLogStatus.Error
  const expectedMessage = mockDynamoAuditLog({ status: expectedStatus })
  gateway.reset([expectedMessage])

  const messageFetcher = new FetchByStatus(gateway, expectedStatus)
  const result = await messageFetcher.fetch()

  expect(isError(result)).toBe(false)

  const actualMessages = <DynamoAuditLog[]>result
  expect(actualMessages).toHaveLength(1)

  const actualMessage = actualMessages[0]
  expect(actualMessage.messageId).toBe(expectedMessage.messageId)
  expect(actualMessage.status).toBe(expectedStatus)
})

it("should return an error when fetchByStatus fails", async () => {
  const expectedError = new Error("Results not found")
  gateway.shouldReturnError(expectedError)

  const messageFetcher = new FetchByStatus(gateway, AuditLogStatus.Processing)
  const result = await messageFetcher.fetch()

  expect(isError(result)).toBe(true)
  expect(result).toBe(expectedError)
})
