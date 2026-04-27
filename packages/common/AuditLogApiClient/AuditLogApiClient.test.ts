import type { AuditLogApiRecordOutput } from "../types/AuditLogRecord"

import { mockApiAuditLogEvent, mockAuditLogApiRecordOutput } from "../test/auditLogMocks"
import "../test/jest"
import AuditLogApiClient from "./AuditLogApiClient"

const apiClient = new AuditLogApiClient("http://localhost", "dummy")
const message = mockAuditLogApiRecordOutput({
  externalCorrelationId: "b5edf595-16a9-450f-a52b-40628cd58c29",
  messageHash: "hash-1"
})
const message2 = mockAuditLogApiRecordOutput({
  externalCorrelationId: "b5edf595-16a9-450f-a52b-40628cd58c28",
  messageHash: "hash-2"
})
const event = mockApiAuditLogEvent()

describe("getAuditLogs()", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return the messages if successful", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve([message, message2]),
      ok: true,
      status: 200
    } as Response)

    const result = await apiClient.getAuditLogs()

    expect(result).toNotBeError()
    expect(result).toEqual([message, message2])
  })

  it("should fail when the error is unknown", async () => {
    const unknownError = new Error("An unknown error")
    jest.spyOn(global, "fetch").mockRejectedValue(unknownError)

    const result = await apiClient.getAuditLogs()

    expect(result).toBeError(`Error getting messages: ${unknownError.message}`)
  })

  it("should filter by status", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve([message, message2]),
      ok: true,
      status: 200
    } as Response)

    const result = await apiClient.getAuditLogs({ status: "Error" })

    expect(result).toNotBeError()
    expect(result).toEqual([message, message2])
    expect(mockFetch.mock.calls[0][0]).toBe("http://localhost/messages?status=Error")
  })

  it("should filter by lastMessageId", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve([message, message2]),
      ok: true,
      status: 200
    } as Response)

    const result = await apiClient.getAuditLogs({ lastMessageId: "12345" })

    expect(result).toNotBeError()
    expect(result).toEqual([message, message2])
    expect(mockFetch.mock.calls[0][0]).toBe("http://localhost/messages?lastMessageId=12345")
  })

  it("should filter by status and lastMessageId", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve([message, message2]),
      ok: true,
      status: 200
    } as Response)

    const result = await apiClient.getAuditLogs({ lastMessageId: "12345", status: "Error" })

    expect(result).toNotBeError()
    expect(result).toEqual([message, message2])
    expect(mockFetch.mock.calls[0][0]).toBe("http://localhost/messages?lastMessageId=12345&status=Error")
  })

  it("should pass through largeObjects and limit", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve([message, message2]),
      ok: true,
      status: 200
    } as Response)

    const result = await apiClient.getAuditLogs({ largeObjects: false, limit: 99 })

    expect(result).toNotBeError()
    expect(result).toEqual([message, message2])
    expect(mockFetch.mock.calls[0][0]).toBe("http://localhost/messages?largeObjects=false&limit=99")
  })
})

describe("getAuditLog()", () => {
  it("should return the message when message exists", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve([message]),
      ok: true,
      status: 200
    } as Response)

    const result = await apiClient.getAuditLog(message.messageId)

    expect(result).toNotBeError()

    const actualMessage = <AuditLogApiRecordOutput>result
    expect(actualMessage.messageId).toBe(message.messageId)
    expect(actualMessage.externalCorrelationId).toBe(message.externalCorrelationId)
    expect(actualMessage.receivedDate).toBe(message.receivedDate)
  })

  it("should fail when the error is unknown", async () => {
    const unknownError = new Error("An unknown error")
    jest.spyOn(global, "fetch").mockRejectedValue(unknownError)

    const result = await apiClient.getAuditLog(message.messageId)

    expect(result).toBeError(`Error getting messages: ${unknownError.message}`)
  })

  it("should pass through the api key as a header", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve([]),
      ok: true,
      status: 200
    } as Response)

    const result = await apiClient.getAuditLog(message.messageId)

    expect(result).toNotBeError()

    const headers = mockFetch.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers["X-API-Key"]).toBe("dummy")
  })
})

describe("createAuditLog()", () => {
  it("should return Created http status code when message successfully created", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve('{ "messageId": "fake" }'),
      ok: true,
      status: 201
    } as Response)

    const result = await apiClient.createAuditLog(message)

    expect(result).toNotBeError()
  })

  it("should fail when message validation fails", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("Message ID is mandatory")
    } as Response)

    const result = await apiClient.createAuditLog(message)

    expect(result).toBeError("Error creating audit log: Message ID is mandatory")
  })

  it("should fail when the error is unknown", async () => {
    const unknownError = new Error("An unknown error")
    jest.spyOn(global, "fetch").mockRejectedValue(unknownError)

    const result = await apiClient.createAuditLog(message)

    expect(result).toBeError(`Error creating audit log: ${unknownError.message}`)
  })

  it("should pass through the api key as a header", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve('{ "messageId": "fake" }'),
      ok: true,
      status: 201
    } as Response)

    const result = await apiClient.createAuditLog(message)

    expect(result).toNotBeError()

    const headers = mockFetch.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers["X-API-Key"]).toBe("dummy")
  })
})

describe("createEvents()", () => {
  it("should return Created http status code when message exists", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 201
    } as Response)

    const result = await apiClient.createEvents(message.messageId, event)

    expect(result).toNotBeError()
  })

  it("should fail when message does not exist", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404
    } as Response)

    const result = await apiClient.createEvents(message.messageId, event)

    expect(result).toBeError(`The message with Id ${message.messageId} does not exist.`)
  })

  it("should fail when the error is unknown", async () => {
    const unknownError = new Error("An unknown error")
    jest.spyOn(global, "fetch").mockRejectedValue(unknownError)

    const result = await apiClient.createEvents(message.messageId, event)

    expect(result).toBeError(`Error creating event: ${unknownError.message}`)
  })

  it("should pass through the api key as a header", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 201
    } as Response)

    const result = await apiClient.createEvents(message.messageId, event)

    expect(result).toNotBeError()

    const headers = mockFetch.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers["X-API-Key"]).toBe("dummy")
  })

  it("should fail when the api request times out", async () => {
    const timedOutResponse = new Error("Connection expired")
    timedOutResponse.name = "AbortError"
    const expectedErrorMsg = `Timed out creating event for message with Id ${message.messageId}.`
    jest.spyOn(global, "fetch").mockRejectedValue(timedOutResponse)

    const result = await apiClient.createEvents(message.messageId, event)

    expect(result).toBeError(expectedErrorMsg)
  })
})

describe("createUserEvent()", () => {
  it("should return Created http status code", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 201
    } as Response)

    const result = await apiClient.createUserEvent("User A", event)

    expect(result).toNotBeError()
  })

  it("should fail when the error is unknown", async () => {
    const unknownError = new Error("An unknown error")
    jest.spyOn(global, "fetch").mockRejectedValue(unknownError)

    const result = await apiClient.createUserEvent("User B", event)

    expect(result).toBeError(`Error creating event: ${unknownError.message}`)
  })

  it("should pass through the api key as a header", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve('{ "messageId": "fake" }'),
      ok: true,
      status: 201
    } as Response)

    const result = await apiClient.createUserEvent("User C", event)

    expect(result).toNotBeError()

    const headers = mockFetch.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers["X-API-Key"]).toBe("dummy")
  })

  it("should fail when the api request times out", async () => {
    const timedOutResponse = new Error("The operation was aborted")
    timedOutResponse.name = "AbortError"
    const expectedErrorMsg = "Timed out creating event for user 'User D'."
    jest.spyOn(global, "fetch").mockRejectedValue(timedOutResponse)

    const result = await apiClient.createUserEvent("User D", event)

    expect(result).toBeError(expectedErrorMsg)
  })
})

describe("retryEvent()", () => {
  it("should succeed when the message exists", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 204
    } as Response)

    const result = await apiClient.retryEvent(message.messageId)

    expect(result).toNotBeError()
  })

  it("should fail when message does not exist", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404
    } as Response)

    const result = await apiClient.retryEvent(message.messageId)

    expect(result).toBeError(`The message with Id ${message.messageId} does not exist.`)
  })

  it("should fail when the error is unknown", async () => {
    const expectedError = new Error("An unknown error")
    jest.spyOn(global, "fetch").mockRejectedValue(expectedError)

    const result = await apiClient.retryEvent(message.messageId)

    expect(result).toBeError(`Error retrying event: ${expectedError.message}`)
  })

  it("should pass through the api key as a header", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 204
    } as Response)

    const result = await apiClient.retryEvent(message.messageId)

    expect(result).toNotBeError()

    const headers = mockFetch.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers["X-API-Key"]).toBe("dummy")
  })
})

describe("sanitiseAuditLog()", () => {
  it("should return NoContent http status code when successful", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 204
    } as Response)

    const result = await apiClient.sanitiseAuditLog(message.messageId)

    expect(result).toNotBeError()
  })

  it("should fail when message does not exist", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404
    } as Response)

    const result = await apiClient.sanitiseAuditLog(message.messageId)

    expect(result).toBeError(`The message with Id ${message.messageId} does not exist.`)
  })

  it("should fail when the api errors", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve("api has gone bang")
    } as Response)

    const result = await apiClient.sanitiseAuditLog(message.messageId)

    expect(result).toBeError("Error from audit log api while sanitising: api has gone bang")
  })

  it("should fail when the error is unknown", async () => {
    const expectedError = new Error("An unknown error")
    jest.spyOn(global, "fetch").mockRejectedValue(expectedError)

    const result = await apiClient.sanitiseAuditLog(message.messageId)

    expect(result).toBeError("Error sanitising message: An unknown error")
  })

  it("should fail when the api request times out", async () => {
    const timedOutResponse = new Error("Connection expired")
    timedOutResponse.name = "AbortError"
    jest.spyOn(global, "fetch").mockRejectedValue(timedOutResponse)

    const result = await apiClient.sanitiseAuditLog(message.messageId)

    expect(result).toBeError("Error sanitising message: Connection expired")
  })
})
