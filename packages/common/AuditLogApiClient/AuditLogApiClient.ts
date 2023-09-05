import type { AxiosError } from "axios"
import axios, { HttpStatusCode } from "axios"
import * as https from "https"
import type { AuditLogEvent } from "../types/AuditLogEvent"
import type { InputApiAuditLog, OutputApiAuditLog } from "../types/AuditLogRecord"
import type { PromiseResult } from "../types/Result"
import ApplicationError from "./ApplicationError"
import addQueryParams from "./addQueryParams"

export type GetMessagesOptions = {
  status?: string
  lastMessageId?: string
  limit?: number
  largeObjects?: boolean
}

export type GetMessageOptions = {
  limit?: number
  includeColumns?: string[]
  excludeColumns?: string[]
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

export default class AuditLogApiClient {
  constructor(
    private readonly apiUrl: string,
    private readonly apiKey: string,
    private readonly timeout: number = 0
  ) {}

  private stringify(message: unknown): string {
    return typeof message === "string" ? message : JSON.stringify(message)
  }

  getMessages(options?: GetMessagesOptions): PromiseResult<OutputApiAuditLog[]> {
    const url = addQueryParams(`${this.apiUrl}/messages`, options)

    return axios
      .get(url, {
        headers: { "X-API-Key": this.apiKey },
        timeout: this.timeout
      })
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        if (error.response?.status === HttpStatusCode.NotFound) {
          return []
        }

        return new ApplicationError(
          `Error getting messages: ${this.stringify(error.response?.data) ?? error.message}`,
          error
        )
      })
  }

  getMessage(messageId: string, options: GetMessageOptions = {}): PromiseResult<OutputApiAuditLog> {
    const queryParams: string[] = []
    let queryString = ""
    if (options?.includeColumns) {
      queryParams.push(`includeColumns=${options.includeColumns.join(",")}`)
    }
    if (options?.excludeColumns) {
      queryParams.push(`includeColumns=${options.excludeColumns.join(",")}`)
    }
    if (queryParams.length > 0) {
      queryString = `?${queryParams.join("&")}`
    }
    return axios
      .get(`${this.apiUrl}/messages/${messageId}${queryString}`, {
        headers: { "X-API-Key": this.apiKey },
        timeout: this.timeout
      })
      .then((response) => response.data)
      .then((result) => result[0])
      .catch((error: AxiosError) => {
        if (error.response?.status === HttpStatusCode.NotFound) {
          return undefined
        }

        return new ApplicationError(
          `Error getting messages: ${this.stringify(error.response?.data) ?? error.message}`,
          error
        )
      })
  }

  getMessageByHash(messageHash: string, options: GetMessageOptions = {}): PromiseResult<OutputApiAuditLog> {
    const queryParams: string[] = [`messageHash=${messageHash}`]

    if (options?.includeColumns) {
      queryParams.push(`includeColumns=${options.includeColumns.join(",")}`)
    }
    if (options?.excludeColumns) {
      queryParams.push(`includeColumns=${options.excludeColumns.join(",")}`)
    }

    const queryString = `?${queryParams.join("&")}`

    return axios
      .get(`${this.apiUrl}/messages${queryString}`, {
        headers: { "X-API-Key": this.apiKey },
        timeout: this.timeout
      })
      .then((response) => response.data)
      .then((result) => result[0])
      .catch((error: AxiosError) => {
        if (error.response?.status === HttpStatusCode.NotFound) {
          return undefined
        }

        return new ApplicationError(
          `Error getting message by hash: ${this.stringify(error.response?.data) ?? error.message}`,
          error
        )
      })
  }

  createAuditLog(auditLog: InputApiAuditLog): PromiseResult<void> {
    return axios
      .post(`${this.apiUrl}/messages`, this.stringify(auditLog), {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey
        },
        // The Audit Log API doesn't return JSON :facepalm:
        transformResponse: (res) => res,
        timeout: this.timeout
      })
      .then((result) => {
        switch (result.status) {
          case HttpStatusCode.Created:
            return undefined
          default:
            return Error(`Error ${result.status}: ${result.data}`)
        }
      })
      .catch((error: AxiosError) => {
        return new ApplicationError(
          `Error creating audit log: ${this.stringify(error.response?.data) ?? error.message}`,
          error
        )
      })
  }

  createEvent(messageId: string, event: AuditLogEvent): PromiseResult<void> {
    return axios
      .post(`${this.apiUrl}/messages/${messageId}/events`, event, {
        httpsAgent,
        headers: {
          "X-API-Key": this.apiKey
        },
        timeout: this.timeout
      })
      .then((result) => {
        switch (result.status) {
          case HttpStatusCode.Created:
            return undefined
          case HttpStatusCode.NotFound:
            return Error(`The message with Id ${messageId} does not exist.`)
          case HttpStatusCode.GatewayTimeout:
            return Error(`Timed out creating event for message with Id ${messageId}.`)
          default:
            return Error(`Error ${result.status}: Could not create audit log event.`)
        }
      })
      .catch((error: AxiosError) => {
        switch (error.code) {
          case "ECONNABORTED":
            return Error(`Timed out creating event for message with Id ${messageId}.`)
          default:
            return new ApplicationError(
              `Error creating event: ${this.stringify(error.response?.data) ?? error.message}`,
              error
            )
        }
      })
  }

  createUserEvent(userName: string, event: AuditLogEvent): PromiseResult<void> {
    return axios
      .post(`${this.apiUrl}/users/${userName}/events`, event, {
        httpsAgent,
        headers: {
          "X-API-Key": this.apiKey
        },
        timeout: this.timeout
      })
      .then((result) => {
        switch (result.status) {
          case HttpStatusCode.Created:
            return undefined
          case HttpStatusCode.GatewayTimeout:
            return Error(`Timed out creating event for user '${userName}'.`)
          default:
            return Error(`Error ${result.status}: Could not create audit log event.`)
        }
      })
      .catch((error: AxiosError) => {
        switch (error.code) {
          case "ECONNABORTED":
            return Error(`Timed out creating event for user '${userName}'.`)
          default:
            return new ApplicationError(
              `Error creating event: ${this.stringify(error.response?.data) ?? error.message}`,
              error
            )
        }
      })
  }

  retryEvent(messageId: string): PromiseResult<void> {
    return axios
      .post(
        `${this.apiUrl}/messages/${messageId}/retry`,
        {},
        {
          httpsAgent,
          headers: {
            "X-API-Key": this.apiKey
          },
          timeout: this.timeout
        }
      )
      .then((result) => {
        switch (result.status) {
          case HttpStatusCode.NoContent:
            return undefined
          case HttpStatusCode.NotFound:
            return Error(`The message with Id ${messageId} does not exist.`)
          default:
            return Error(`Error ${result.status}: Could not retry audit log event.`)
        }
      })
      .catch((error: AxiosError) => {
        return new ApplicationError(
          `Error retrying event: ${this.stringify(error.response?.data) ?? error.message}`,
          error
        )
      })
  }

  fetchUnsanitised(options: GetMessageOptions = {}): PromiseResult<OutputApiAuditLog[]> {
    const url = addQueryParams(`${this.apiUrl}/messages`, {
      limit: options.limit,
      includeColumns: options.includeColumns?.join(","),
      excludeColumns: options.excludeColumns?.join(","),
      unsanitised: true
    })

    return axios
      .get(url, {
        headers: { "X-API-Key": this.apiKey },
        timeout: this.timeout
      })
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        return new ApplicationError(
          `Error getting unsanitised messages: ${this.stringify(error.response?.data) ?? error.message}`,
          error
        )
      })
  }

  sanitiseMessage(messageId: string): PromiseResult<void> {
    return axios
      .post(
        `${this.apiUrl}/messages/${messageId}/sanitise`,
        {},
        {
          httpsAgent,
          headers: {
            "X-API-Key": this.apiKey
          },
          timeout: this.timeout
        }
      )
      .then((result) => {
        if (result.status === HttpStatusCode.NoContent) {
          return
        } else if (result.status === HttpStatusCode.NotFound) {
          return Error(`The message with Id ${messageId} does not exist.`)
        } else {
          return new ApplicationError(
            `Error from audit log api while sanitising: ${this.stringify(result.data)}`,
            result.data
          )
        }
      })
      .catch((error: AxiosError) => {
        return new ApplicationError(
          `Error sanitising message: ${this.stringify(error.response?.data) ?? error.message}`,
          error
        )
      })
  }
}
