import type { AxiosError } from "axios"
import axios from "axios"
import { mockApiAuditLogEvent, mockAuditLogApiRecordOutput } from "../test/auditLogMocks"
import "../test/jest"
import type { AuditLogApiRecordOutput } from "../types/AuditLogRecord"
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

const createErrorResponse = (errorCode: number, errorMessage: string): AxiosError =>
  ({
    message: `Axios error: ${errorMessage}`,
    response: { status: errorCode, data: errorMessage }
  }) as unknown as AxiosError

describe("getMessages()", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return the messages if successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ status: 200, data: [message, message2] })

    const result = await apiClient.getMessages()

    expect(result).toNotBeError()
    expect(result).toEqual([message, message2])
  })

  it("should fail when the error is unknown", async () => {
    const expectedError = <AxiosError>new Error("An unknown error")
    jest.spyOn(axios, "get").mockRejectedValue(expectedError)

    const result = await apiClient.getMessages()

    expect(result).toBeError(`Error getting messages: ${expectedError.message}`)
  })

  it("should filter by status", async () => {
    const getRequest = jest.spyOn(axios, "get").mockResolvedValue({ status: 200, data: [message, message2] })

    const result = await apiClient.getMessages({ status: "Error" })

    expect(result).toNotBeError()
    expect(result).toEqual([message, message2])
    expect(getRequest.mock.calls[0][0]).toBe("http://localhost/messages?status=Error")
  })

  it("should filter by lastMessageId", async () => {
    const getRequest = jest.spyOn(axios, "get").mockResolvedValue({ status: 200, data: [message, message2] })

    const result = await apiClient.getMessages({ lastMessageId: "12345" })

    expect(result).toNotBeError()
    expect(result).toEqual([message, message2])
    expect(getRequest.mock.calls[0][0]).toBe("http://localhost/messages?lastMessageId=12345")
  })

  it("should filter by status and lastMessageId", async () => {
    const getRequest = jest.spyOn(axios, "get").mockResolvedValue({ status: 200, data: [message, message2] })

    const result = await apiClient.getMessages({ status: "Error", lastMessageId: "12345" })

    expect(result).toNotBeError()
    expect(result).toEqual([message, message2])
    expect(getRequest.mock.calls[0][0]).toBe("http://localhost/messages?status=Error&lastMessageId=12345")
  })

  it("should pass through largeObjects and limit", async () => {
    const getRequest = jest.spyOn(axios, "get").mockResolvedValue({ status: 200, data: [message, message2] })

    const result = await apiClient.getMessages({ limit: 99, largeObjects: false })

    expect(result).toNotBeError()
    expect(result).toEqual([message, message2])
    expect(getRequest.mock.calls[0][0]).toBe("http://localhost/messages?limit=99&largeObjects=false")
  })
})

describe("getMessage()", () => {
  it("should return the message when message exists", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ status: 200, data: [message] })

    const result = await apiClient.getMessage(message.messageId)

    expect(result).toNotBeError()

    const actualMessage = <AuditLogApiRecordOutput>result
    expect(actualMessage.messageId).toBe(message.messageId)
    expect(actualMessage.externalCorrelationId).toBe(message.externalCorrelationId)
    expect(actualMessage.receivedDate).toBe(message.receivedDate)
  })

  it("should fail when the error is unknown", async () => {
    const expectedError = <AxiosError>new Error("An unknown error")
    jest.spyOn(axios, "get").mockRejectedValue(expectedError)

    const result = await apiClient.getMessage(message.messageId)

    expect(result).toBeError(`Error getting messages: ${expectedError.message}`)
  })

  it("should pass through the api key as a header", async () => {
    const mockGet = jest.spyOn(axios, "get").mockResolvedValue({ status: 200, data: [] })

    const result = await apiClient.getMessage(message.messageId)

    expect(result).toNotBeError()

    const headers = mockGet.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers["X-API-Key"]).toBe("dummy")
  })
})

describe("createAuditLog()", () => {
  it("should return Created http status code when message successfully created", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 201 })

    const result = await apiClient.createAuditLog(message)

    expect(result).toNotBeError()
  })

  it("should fail when message validation fails", async () => {
    const expectedError = createErrorResponse(400, "Message ID is mandatory")
    jest.spyOn(axios, "post").mockRejectedValue(expectedError)

    const result = await apiClient.createAuditLog(message)

    expect(result).toBeError("Error creating audit log: Message ID is mandatory")
  })

  it("should fail when the error is unknown", async () => {
    const expectedError = <AxiosError>new Error("An unknown error")
    jest.spyOn(axios, "post").mockRejectedValue(expectedError)

    const result = await apiClient.createAuditLog(message)

    expect(result).toBeError(`Error creating audit log: ${expectedError.message}`)
  })

  it("should pass through the api key as a header", async () => {
    const mockPost = jest.spyOn(axios, "post").mockResolvedValue({ status: 201 })

    const result = await apiClient.createAuditLog(message)

    expect(result).toNotBeError()

    const headers = mockPost.mock.calls[0][2]?.headers as Record<string, string>
    expect(headers["X-API-Key"]).toBe("dummy")
  })
})

describe("createEvent()", () => {
  it("should return Created http status code when message exists", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 201 })

    const result = await apiClient.createEvent(message.messageId, event)

    expect(result).toNotBeError()
  })

  it("should fail when message does not exist", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 404 })

    const result = await apiClient.createEvent(message.messageId, event)

    expect(result).toBeError(`The message with Id ${message.messageId} does not exist.`)
  })

  it("should fail when the error is unknown", async () => {
    const expectedError = <AxiosError>new Error("An unknown error")
    jest.spyOn(axios, "post").mockRejectedValue(expectedError)

    const result = await apiClient.createEvent(message.messageId, event)

    expect(result).toBeError(`Error creating event: ${expectedError.message}`)
  })

  it("should pass through the api key as a header", async () => {
    const mockPost = jest.spyOn(axios, "post").mockResolvedValue({ status: 201 })

    const result = await apiClient.createEvent(message.messageId, event)

    expect(result).toNotBeError()

    const headers = mockPost.mock.calls[0][2]?.headers as Record<string, string>
    expect(headers["X-API-Key"]).toBe("dummy")
  })

  it("should fail when the api request times out", async () => {
    const timedOutResponse = <AxiosError>{ code: "ECONNABORTED" }
    const expectedErrorMsg = `Timed out creating event for message with Id ${message.messageId}.`
    jest.spyOn(axios, "post").mockRejectedValue(timedOutResponse)

    const result = await apiClient.createEvent(message.messageId, event)

    expect(result).toBeError(expectedErrorMsg)
  })
})

describe("createUserEvent()", () => {
  it("should return Created http status code", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 201 })

    const result = await apiClient.createUserEvent("User A", event)

    expect(result).toNotBeError()
  })

  it("should fail when the error is unknown", async () => {
    const expectedError = <AxiosError>new Error("An unknown error")
    jest.spyOn(axios, "post").mockRejectedValue(expectedError)

    const result = await apiClient.createUserEvent("User B", event)

    expect(result).toBeError(`Error creating event: ${expectedError.message}`)
  })

  it("should pass through the api key as a header", async () => {
    const mockPost = jest.spyOn(axios, "post").mockResolvedValue({ status: 201 })

    const result = await apiClient.createUserEvent("User C", event)

    expect(result).toNotBeError()

    const headers = mockPost.mock.calls[0][2]?.headers as Record<string, string>
    expect(headers["X-API-Key"]).toBe("dummy")
  })

  it("should fail when the api request times out", async () => {
    const timedOutResponse = <AxiosError>{ code: "ECONNABORTED" }
    const expectedErrorMsg = "Timed out creating event for user 'User D'."
    jest.spyOn(axios, "post").mockRejectedValue(timedOutResponse)

    const result = await apiClient.createUserEvent("User D", event)

    expect(result).toBeError(expectedErrorMsg)
  })
})

describe("retryEvent()", () => {
  it("should succeed when the message exists", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 204 })

    const result = await apiClient.retryEvent(message.messageId)

    expect(result).toNotBeError()
  })

  it("should fail when message does not exist", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 404 })

    const result = await apiClient.retryEvent(message.messageId)

    expect(result).toBeError(`The message with Id ${message.messageId} does not exist.`)
  })

  it("should fail when the error is unknown", async () => {
    const expectedError = <AxiosError>new Error("An unknown error")
    jest.spyOn(axios, "post").mockRejectedValue(expectedError)

    const result = await apiClient.retryEvent(message.messageId)

    expect(result).toBeError(`Error retrying event: ${expectedError.message}`)
  })

  it("should pass through the api key as a header", async () => {
    const mockPost = jest.spyOn(axios, "post").mockResolvedValue({ status: 204 })

    const result = await apiClient.retryEvent(message.messageId)

    expect(result).toNotBeError()

    const headers = mockPost.mock.calls[0][2]?.headers as Record<string, string>
    expect(headers["X-API-Key"]).toBe("dummy")
  })
})

describe("sanitiseMessage()", () => {
  it("should return NoContent http status code when successful", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 204 })

    const result = await apiClient.sanitiseMessage(message.messageId)

    expect(result).toNotBeError()
  })

  it("should fail when message does not exist", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 404 })

    const result = await apiClient.sanitiseMessage(message.messageId)

    expect(result).toBeError(`The message with Id ${message.messageId} does not exist.`)
  })

  it("should fail when the api errors", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 500, data: "api has gone bang" })

    const result = await apiClient.sanitiseMessage(message.messageId)

    expect(result).toBeError("Error from audit log api while sanitising: api has gone bang")
  })

  it("should fail when the error is unknown", async () => {
    const expectedError = <AxiosError>new Error("An unknown error")
    jest.spyOn(axios, "post").mockRejectedValue(expectedError)

    const result = await apiClient.sanitiseMessage(message.messageId)

    expect(result).toBeError("Error sanitising message: An unknown error")
  })

  it("should fail when the api request times out", async () => {
    const timedOutResponse = <AxiosError>{ code: "ECONNABORTED", message: "Connection expired" }
    jest.spyOn(axios, "post").mockRejectedValue(timedOutResponse)

    const result = await apiClient.sanitiseMessage(message.messageId)

    expect(result).toBeError("Error sanitising message: Connection expired")
  })
})
