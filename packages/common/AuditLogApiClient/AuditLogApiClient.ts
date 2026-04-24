import type { AxiosError } from "axios"

import axios, { HttpStatusCode } from "axios"
import * as https from "https"

import type { AuditLogEvent } from "../types/AuditLogEvent"
import type { AuditLogApiRecordInput, AuditLogApiRecordOutput } from "../types/AuditLogRecord"
import type { PromiseResult } from "../types/Result"

import addQueryParams from "./addQueryParams"
import ApplicationError, { AlreadyExistsError } from "./ApplicationError"

export type GetAuditLogOptions = {
  excludeColumns?: string[]
  includeColumns?: string[]
  limit?: number
}

export type GetAuditLogsOptions = {
  externalCorrelationId?: string
  largeObjects?: boolean
  lastMessageId?: string
  limit?: number
  status?: string
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

export default class AuditLogApiClient {
  private get apiKeyHeader(): Record<string, string> {
    if (this.isB7Api()) {
      return { Authorization: this.apiKey }
    }

    return { "X-API-Key": this.apiKey }
  }

  private get baseUrl(): string {
    return `${this.apiUrl}/${this.basePath}`
  }
  constructor(
    private readonly apiUrl: string,
    private readonly apiKey: string,
    private readonly timeout: number = 0,
    private readonly basePath: string = "messages"
  ) {}

  createAuditLog(auditLog: AuditLogApiRecordInput): PromiseResult<AuditLogApiRecordOutput> {
    return fetch(this.baseUrl, {
      body: this.stringify(auditLog),
      headers: {
        "Content-Type": "application/json",
        ...this.apiKeyHeader
      },
      method: "POST"
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          if (/A message with Id [^ ]* already exists in the database/.test(text)) {
            return new AlreadyExistsError(`Message already exists in the database: ${auditLog.messageId}`)
          }

          return new ApplicationError(`Error creating audit log: ${text}`, new Error(text))
        })
      }

      switch (response.status) {
        case HttpStatusCode.Created:
          return response.json().then((data) => JSON.parse(data)) as Promise<AuditLogApiRecordOutput>
        default:
          return Error(`Error ${response.status}: ${response.json().then((data) => this.stringify(data))}`)
      }
    })
  }

  createEvents(correlationId: string, event: AuditLogEvent | AuditLogEvent[]): PromiseResult<void> {
    return axios
      .post(`${this.baseUrl}/${correlationId}/events`, event, {
        headers: {
          ...this.apiKeyHeader
        },
        httpsAgent,
        timeout: this.timeout,
        // The Audit Log API doesn't return JSON :facepalm:
        transformResponse: (res) => res
      })
      .then((result) => {
        switch (result.status) {
          case HttpStatusCode.Created:
            return undefined
          case HttpStatusCode.GatewayTimeout:
            return Error(`Timed out creating event for message with Id ${correlationId}.`)
          case HttpStatusCode.NotFound:
            return Error(`The message with Id ${correlationId} does not exist.`)
          default:
            return Error(`Error ${result.status}: Could not create audit log event.`)
        }
      })
      .catch((error: AxiosError) => {
        switch (error.code) {
          case "ECONNABORTED":
            return Error(`Timed out creating event for message with Id ${correlationId}.`)
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
        headers: {
          ...this.apiKeyHeader
        },
        httpsAgent,
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

  fetchUnsanitised(options: GetAuditLogOptions = {}): PromiseResult<AuditLogApiRecordOutput[]> {
    const url = addQueryParams(this.baseUrl, {
      excludeColumns: options.excludeColumns?.join(","),
      includeColumns: options.includeColumns?.join(","),
      limit: options.limit,
      unsanitised: true
    })

    return axios
      .get(url, {
        headers: { ...this.apiKeyHeader },
        httpsAgent,
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

  getAuditLog(correlationId: string, options: GetAuditLogOptions = {}): PromiseResult<AuditLogApiRecordOutput> {
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

    const url = `${this.baseUrl}/${correlationId}${queryString}`

    return fetch(url, {
      headers: {
        ...this.apiKeyHeader
      },
      method: "GET"
    }).then((response) => {
      if (response.status === HttpStatusCode.NotFound) {
        return new ApplicationError("Error getting messages: Not Found", new Error("Not Found"))
      }

      if (!response.ok) {
        return response.text().then((text) => {
          return new ApplicationError(`Error getting messages: ${text}`, new Error(text))
        })
      }

      const data = response.json().then((result) => (this.isB7Api() ? result : result[0]))

      return data as Promise<AuditLogApiRecordOutput>
    })
  }

  getAuditLogs(options?: GetAuditLogsOptions): PromiseResult<AuditLogApiRecordOutput[]> {
    const url = addQueryParams(this.baseUrl, options)

    return fetch(url, {
      headers: {
        ...this.apiKeyHeader
      },
      method: "GET"
    }).then((response) => {
      if (response.status === HttpStatusCode.NotFound) {
        return []
      }

      if (!response.ok) {
        return response.text().then((text) => {
          return new ApplicationError(`Error getting messages: ${text}`, new Error(text))
        })
      }

      return response.json() as Promise<AuditLogApiRecordOutput[]>
    })
  }

  getAuditLogsByHash(messageHash: string, options: GetAuditLogOptions = {}): PromiseResult<AuditLogApiRecordOutput[]> {
    const queryParams: string[] = [`messageHash=${messageHash}`]

    if (options?.includeColumns) {
      queryParams.push(`includeColumns=${options.includeColumns.join(",")}`)
    }

    if (options?.excludeColumns) {
      queryParams.push(`includeColumns=${options.excludeColumns.join(",")}`)
    }

    const queryString = `?${queryParams.join("&")}`

    return axios
      .get(`${this.baseUrl}${queryString}`, {
        headers: { ...this.apiKeyHeader },
        httpsAgent,
        timeout: this.timeout
      })
      .then((response) => response.data)
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

  retryEvent(correlationId: string): PromiseResult<void> {
    return axios
      .post(
        `${this.baseUrl}/${correlationId}/retry`,
        {},
        {
          headers: {
            ...this.apiKeyHeader
          },
          httpsAgent,
          timeout: this.timeout
        }
      )
      .then((result) => {
        switch (result.status) {
          case HttpStatusCode.NoContent:
            return undefined
          case HttpStatusCode.NotFound:
            return Error(`The message with Id ${correlationId} does not exist.`)
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

  sanitiseAuditLog(correlationId: string): PromiseResult<void> {
    return axios
      .post(
        `${this.baseUrl}/${correlationId}/sanitise`,
        {},
        {
          headers: {
            ...this.apiKeyHeader
          },
          httpsAgent,
          timeout: this.timeout
        }
      )
      .then((result) => {
        if (result.status === HttpStatusCode.NoContent) {
          return
        } else if (result.status === HttpStatusCode.NotFound) {
          return Error(`The message with Id ${correlationId} does not exist.`)
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

  private isB7Api(): boolean {
    return this.apiKey.startsWith("Bearer ")
  }

  private stringify(message: unknown): string {
    return typeof message === "string" ? message : JSON.stringify(message)
  }
}
