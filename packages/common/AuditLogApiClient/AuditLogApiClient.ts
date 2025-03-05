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
    if (this.apiKey.startsWith("Bearer ")) {
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
    return axios
      .post(this.baseUrl, this.stringify(auditLog), {
        headers: {
          "Content-Type": "application/json",
          ...this.apiKeyHeader
        },
        timeout: this.timeout,
        // The Audit Log API doesn't return JSON :facepalm:
        transformResponse: (res) => res
      })
      .then((result) => {
        switch (result.status) {
          case HttpStatusCode.Created:
            return JSON.parse(result.data) as AuditLogApiRecordOutput
          default:
            return Error(`Error ${result.status}: ${result.data}`)
        }
      })
      .catch((error: AxiosError) => {
        const apiError = error.response?.data ? this.stringify(error.response?.data) : error.message
        if (/A message with Id [^ ]* already exists in the database/.test(apiError)) {
          return new AlreadyExistsError()
        }

        return new ApplicationError(`Error creating audit log: ${apiError}`, error)
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

    return axios
      .get(`${this.baseUrl}/${correlationId}${queryString}`, {
        headers: { ...this.apiKeyHeader },
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

  getAuditLogs(options?: GetAuditLogsOptions): PromiseResult<AuditLogApiRecordOutput[]> {
    const url = addQueryParams(this.baseUrl, options)

    return axios
      .get(url, {
        headers: { ...this.apiKeyHeader },
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

  private stringify(message: unknown): string {
    return typeof message === "string" ? message : JSON.stringify(message)
  }
}
