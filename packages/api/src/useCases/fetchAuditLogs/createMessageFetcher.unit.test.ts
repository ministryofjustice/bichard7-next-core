import type { AuditLogQueryParameters } from "../../types/AuditLogQueryParameters"

import FakeAuditLogDynamoGateway from "../../tests/testGateways/FakeAuditLogDynamoGateway"
import createMessageFetcher from "./createMessageFetcher"
import FetchAll from "./FetchAll"
import FetchByExternalCorrelationId from "./FetchByExternalCorrelationId"
import FetchByHash from "./FetchByHash"
import FetchById from "./FetchById"
import FetchByStatus from "./FetchByStatus"

const gateway = new FakeAuditLogDynamoGateway()

describe("createMessageFetcher()", () => {
  it("should return FetchAll when there are no path or query string parameters", () => {
    const event: AuditLogQueryParameters = {}

    const messageFetcher = createMessageFetcher(event, gateway)

    expect(messageFetcher instanceof FetchAll).toBe(true)
  })

  it("should return FetchById when messageId exists in the path", () => {
    const event: AuditLogQueryParameters = {
      messageId: "1"
    }

    const messageFetcher = createMessageFetcher(event, gateway)

    expect(messageFetcher instanceof FetchById).toBe(true)
  })

  it("should return FetchByHash when messageHash exists in the query", () => {
    const event: AuditLogQueryParameters = {
      messageHash: "1"
    }

    const messageFetcher = createMessageFetcher(event, gateway)

    expect(messageFetcher instanceof FetchByHash).toBe(true)
  })

  it("should return FetchByExternalCorrelationId when externalCorrelationId exists in the query string", () => {
    const event: AuditLogQueryParameters = {
      externalCorrelationId: "1"
    }

    const messageFetcher = createMessageFetcher(event, gateway)

    expect(messageFetcher instanceof FetchByExternalCorrelationId).toBe(true)
  })

  it("should return FetchById when messageId and externalCorrelationId exist in the path and query string", () => {
    const event: AuditLogQueryParameters = {
      externalCorrelationId: "2",
      messageId: "1"
    }

    const messageFetcher = createMessageFetcher(event, gateway)

    expect(messageFetcher instanceof FetchById).toBe(true)
  })

  it("should return messages by status when status parameter exists in the query string", () => {
    const event: AuditLogQueryParameters = {
      status: "Status"
    }

    const messageFetcher = createMessageFetcher(event, gateway)

    expect(messageFetcher instanceof FetchByStatus).toBe(true)
  })
})
