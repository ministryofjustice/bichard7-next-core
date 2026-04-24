import type { AxiosError } from "axios"

import axios, { HttpStatusCode } from "axios"
import * as https from "https"

import type { AuditLogEvent } from "../types/AuditLogEvent"
import type { AuditLogApiRecordInput, AuditLogApiRecordOutput } from "../types/AuditLogRecord"
import type { PromiseResult, Result } from "../types/Result"

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
    const url = this.baseUrl
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    return fetch(url, {
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      agent: this.httpsAgent,
      body: this.stringify(auditLog),
      headers: {
        "Content-Type": "application/json",
        ...this.apiKeyHeader
      },
      method: "POST",
      signal: controller.signal
    })
      .then((response): Promise<Result<AuditLogApiRecordOutput>> | Result<AuditLogApiRecordOutput> => {
        clearTimeout(timeoutId)

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
            return response.json() as Promise<AuditLogApiRecordOutput>
          default:
            return response.text().then((text) => {
              return new Error(`Error ${response.status}: ${text || "Could not create audit log."}`)
            })
        }
      })
      .catch((err: unknown) => {
        clearTimeout(timeoutId)

        if (err instanceof Error && err.name === "AbortError") {
          return new Error(`Timed out creating audit log for message with Id ${auditLog.messageId}.`)
        }

        const errorInstance = err instanceof Error ? err : new Error(String(err))

        return new ApplicationError(`Error creating audit log: ${errorInstance.message}`, errorInstance)
      }) as PromiseResult<AuditLogApiRecordOutput>
  }

  createEvents(correlationId: string, event: AuditLogEvent | AuditLogEvent[]): PromiseResult<void> {
    const url = `${this.baseUrl}/${correlationId}/events`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    return fetch(url, {
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      agent: this.httpsAgent,
      body: JSON.stringify(event),
      headers: {
        ...this.apiKeyHeader,
        "Content-Type": "application/json"
      },
      method: "POST",
      signal: controller.signal
    })
      .then((response) => {
        clearTimeout(timeoutId)
        console.log(response)

        switch (response.status) {
          case 201:
            return undefined

          case 404:
            return new Error(`The message with Id ${correlationId} does not exist.`)

          case 504:
            return new Error(`Timed out creating event for message with Id ${correlationId}.`)

          default:
            return response.text().then((text) => {
              return new ApplicationError(
                `Error ${response.status}: ${text || "Could not create audit log event."}`,
                new Error(text)
              )
            })
        }
      })
      .catch((error: unknown) => {
        console.log(error)
        clearTimeout(timeoutId)

        if (error instanceof Error && error.name === "AbortError") {
          return new Error(`Timed out creating event for message with Id ${correlationId}.`)
        }

        const errorInstance = error instanceof Error ? error : new Error(String(error))

        return new ApplicationError(`Error creating event: ${errorInstance.message}`, errorInstance)
      }) as PromiseResult<void>
  }

  createUserEvent(userName: string, event: AuditLogEvent): PromiseResult<void> {
    const url = `${this.apiUrl}/users/${userName}/events`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    return fetch(url, {
      // @ts-ignore
      agent: this.httpsAgent,
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
        ...this.apiKeyHeader
      },
      method: "POST",
      signal: controller.signal
    })
      .then((response): Promise<Result<void>> | Result<void> => {
        clearTimeout(timeoutId)

        switch (response.status) {
          case HttpStatusCode.Created:
            return undefined

          case HttpStatusCode.GatewayTimeout:
            return new Error(`Timed out creating event for user '${userName}'.`)

          default:
            return response.text().then((text) => {
              return new Error(`Error ${response.status}: ${text || "Could not create audit log event."}`)
            })
        }
      })
      .catch((err: unknown): Result<void> => {
        clearTimeout(timeoutId)

        if (err instanceof Error) {
          console.log(err.name)
        }

        if (err instanceof Error && err.name === "AbortError") {
          return new Error(`Timed out creating event for user '${userName}'.`)
        }

        const errorInstance = err instanceof Error ? err : new Error(String(err))

        return new ApplicationError(`Error creating event: ${errorInstance.message}`, errorInstance)
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
    const queryParams = new URLSearchParams()
    if (options?.includeColumns) {
      queryParams.append("includeColumns", options.includeColumns.join(","))
    }

    if (options?.excludeColumns) {
      queryParams.append("excludeColumns", options.excludeColumns.join(","))
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
    const url = `${this.baseUrl}/${correlationId}${queryString}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    return fetch(url, {
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      agent: this.httpsAgent,
      headers: {
        ...this.apiKeyHeader
      },
      method: "GET",
      signal: controller.signal
    })
      .then((response): Promise<Result<AuditLogApiRecordOutput>> | Result<AuditLogApiRecordOutput> => {
        clearTimeout(timeoutId)

        if (response.status === HttpStatusCode.NotFound) {
          return new ApplicationError("Error getting messages: Not Found", new Error("Not Found"))
        }

        if (!response.ok) {
          return response.text().then((text) => {
            return new ApplicationError(`Error getting messages: ${text}`, new Error(text))
          })
        }

        return response.json().then((result) => {
          const data = this.isB7Api() ? result : result[0]
          return data as AuditLogApiRecordOutput
        })
      })
      .catch((err: unknown): Result<AuditLogApiRecordOutput> => {
        clearTimeout(timeoutId)

        if (err instanceof Error && err.name === "AbortError") {
          return new Error(`Timed out getting audit log for correlation Id ${correlationId}.`)
        }

        const errorInstance = err instanceof Error ? err : new Error(String(err))
        return new ApplicationError(`Error getting messages: ${errorInstance.message}`, errorInstance)
      })
  }

  getAuditLogs(options?: GetAuditLogsOptions): PromiseResult<AuditLogApiRecordOutput[]> {
    const url = addQueryParams(this.baseUrl, options)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    return fetch(url, {
      // @ts-ignore
      agent: this.httpsAgent,
      headers: {
        ...this.apiKeyHeader
      },
      method: "GET",
      signal: controller.signal
    })
      .then((response): Promise<Result<AuditLogApiRecordOutput[]>> | Result<AuditLogApiRecordOutput[]> => {
        clearTimeout(timeoutId)

        // 404 on a list request typically returns an empty array in your logic
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
      .catch((err: unknown): Result<AuditLogApiRecordOutput[]> => {
        clearTimeout(timeoutId)

        if (err instanceof Error && err.name === "AbortError") {
          return new Error("Timed out getting audit logs.")
        }

        const errorInstance = err instanceof Error ? err : new Error(String(err))
        return new ApplicationError(`Error getting messages: ${errorInstance.message}`, errorInstance)
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
    const url = `${this.baseUrl}/${correlationId}/retry`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    return fetch(url, {
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      agent: this.httpsAgent,
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        ...this.apiKeyHeader
      },
      method: "POST",
      signal: controller.signal
    })
      .then((response): Promise<Result<void>> | Result<void> => {
        clearTimeout(timeoutId)

        switch (response.status) {
          case HttpStatusCode.NoContent:
            return undefined
          case HttpStatusCode.NotFound:
            return new Error(`The message with Id ${correlationId} does not exist.`)
          default:
            return response.text().then((text) => {
              return new Error(`Error ${response.status}: ${text || "Could not retry audit log event."}`)
            })
        }
      })
      .catch((err: unknown): Result<void> => {
        clearTimeout(timeoutId)

        if (err instanceof Error && err.name === "AbortError") {
          return new Error(`Timed out retrying event for message with Id ${correlationId}.`)
        }

        const errorInstance = err instanceof Error ? err : new Error(String(err))

        return new ApplicationError(`Error retrying event: ${errorInstance.message}`, errorInstance)
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
