import { Agent } from "undici"

import type { AuditLogEvent } from "../types/AuditLogEvent"
import type { AuditLogApiRecordInput, AuditLogApiRecordOutput } from "../types/AuditLogRecord"
import type { PromiseResult, Result } from "../types/Result"

import addQueryParams from "./addQueryParams"
import ApplicationError, { AlreadyExistsError } from "./ApplicationError"
import HttpStatusCode from "./HttpStatusCode"

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

const undiciDispatcher = new Agent({
  connect: {
    rejectUnauthorized: false
  }
})

export const handleApiError = (
  error: unknown,
  timeoutErrorMessage: string,
  applicationErrorMessage: string
): Result<Error> => {
  if (error instanceof Error && error.name === "AbortError") {
    return new Error(`Timed out ${timeoutErrorMessage}.`)
  }

  const errorInstance = error instanceof Error ? error : new Error(String(error))
  return new ApplicationError(`Error ${applicationErrorMessage}: ${errorInstance.message}`, errorInstance)
}

export default class AuditLogApiClient {
  private readonly signal: AbortSignal | undefined

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
  ) {
    this.signal = this.timeout > 0 ? AbortSignal.timeout(this.timeout) : undefined
  }

  createAuditLog(auditLog: AuditLogApiRecordInput): PromiseResult<AuditLogApiRecordOutput> {
    const url = this.baseUrl

    return fetch(url, {
      body: this.stringify(auditLog),
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      dispatcher: undiciDispatcher,
      headers: {
        "Content-Type": "application/json",
        ...this.apiKeyHeader
      },
      method: "POST",
      signal: this.signal
    })
      .then((response): Promise<Result<AuditLogApiRecordOutput>> | Result<AuditLogApiRecordOutput> => {
        if (response.status === HttpStatusCode.created) {
          return response.json()
        }

        return response.text().then((text) => {
          if (/A message with Id [^ ]* already exists in the database/.test(text)) {
            return new AlreadyExistsError(`Message already exists in the database: ${auditLog.messageId}`)
          }

          return new ApplicationError(`Error creating audit log: ${text}`, new Error(text))
        })
      })
      .catch((error: unknown) =>
        handleApiError(error, `creating audit log for message with Id ${auditLog.messageId}`, "creating audit log")
      )
  }

  createEvents(correlationId: string, event: AuditLogEvent | AuditLogEvent[]): PromiseResult<void> {
    const url = `${this.baseUrl}/${correlationId}/events`

    return fetch(url, {
      body: JSON.stringify(event),
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      dispatcher: undiciDispatcher,
      headers: {
        ...this.apiKeyHeader,
        "Content-Type": "application/json"
      },
      method: "POST",
      signal: this.signal
    })
      .then((response) => {
        if (response.status === HttpStatusCode.created) {
          return
        }

        switch (response.status) {
          case HttpStatusCode.gatewayTimeout:
            return new Error(`Timed out creating event for message with Id ${correlationId}.`)
          case HttpStatusCode.notFound:
            return new Error(`The message with Id ${correlationId} does not exist.`)
        }

        return response.text().then((text) => {
          return new ApplicationError(`Error ${response.status}: Could not create audit log event.`, new Error(text))
        })
      })
      .catch((error: unknown) =>
        handleApiError(error, `creating event for message with Id ${correlationId}`, "creating event")
      )
  }

  createUserEvent(userName: string, event: AuditLogEvent): PromiseResult<void> {
    const url = `${this.apiUrl}/users/${userName}/events`

    return fetch(url, {
      body: JSON.stringify(event),
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      dispatcher: undiciDispatcher,
      headers: {
        "Content-Type": "application/json",
        ...this.apiKeyHeader
      },
      method: "POST",
      signal: this.signal
    })
      .then((response): Promise<Result<void>> | Result<void> => {
        if (response.status === HttpStatusCode.created) {
          return
        }

        if (response.status === HttpStatusCode.gatewayTimeout) {
          return new Error(`Timed out creating event for user '${userName}'.`)
        }

        return response.text().then(() => {
          return new Error(`Error ${response.status}: Could not create audit log event.`)
        })
      })
      .catch(
        (error: unknown): Result<void> =>
          handleApiError(error, `creating event for user '${userName}'`, "creating event")
      )
  }

  fetchUnsanitised(options: GetAuditLogOptions = {}): PromiseResult<AuditLogApiRecordOutput[]> {
    const url = addQueryParams(this.baseUrl, {
      excludeColumns: options.excludeColumns?.join(","),
      includeColumns: options.includeColumns?.join(","),
      limit: options.limit,
      unsanitised: true
    })

    return fetch(url, {
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      dispatcher: undiciDispatcher,
      headers: {
        ...this.apiKeyHeader
      },
      method: "GET",
      signal: this.signal
    })
      .then((response): Promise<Result<AuditLogApiRecordOutput[]>> | Result<AuditLogApiRecordOutput[]> => {
        if (response.ok) {
          return response.json()
        }

        return response.text().then((text) => {
          return new ApplicationError(`Error getting unsanitised messages: ${text}`, new Error(text))
        })
      })
      .catch(
        (error: unknown): Result<AuditLogApiRecordOutput[]> =>
          handleApiError(error, "getting unsanitised messages", "getting unsanitised messages")
      )
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
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      dispatcher: undiciDispatcher,
      headers: {
        ...this.apiKeyHeader
      },
      method: "GET",
      signal: this.signal
    })
      .then((response): Promise<Result<AuditLogApiRecordOutput>> | Result<AuditLogApiRecordOutput> => {
        if (response.ok) {
          return response.json().then((result) => {
            const data = this.isB7Api() ? result : result[0]
            return data as AuditLogApiRecordOutput
          })
        }

        if (response.status === HttpStatusCode.notFound) {
          return undefined as unknown as AuditLogApiRecordOutput
        }

        return response.text().then((text) => {
          return new ApplicationError(`Error getting messages: ${text}`, new Error(text))
        })
      })
      .catch(
        (error: unknown): Result<AuditLogApiRecordOutput> =>
          handleApiError(error, `getting messages for correlation Id ${correlationId}`, "getting messages")
      )
  }

  getAuditLogs(options?: GetAuditLogsOptions): PromiseResult<AuditLogApiRecordOutput[]> {
    const url = addQueryParams(this.baseUrl, options)

    return fetch(url, {
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      dispatcher: undiciDispatcher,
      headers: {
        ...this.apiKeyHeader
      },
      method: "GET",
      signal: this.signal
    })
      .then((response): Promise<Result<AuditLogApiRecordOutput[]>> | Result<AuditLogApiRecordOutput[]> => {
        if (response.ok) {
          return response.json()
        }

        if (response.status === HttpStatusCode.notFound) {
          return []
        }

        return response.text().then((text) => {
          return new ApplicationError(`Error getting messages: ${text}`, new Error(text))
        })
      })
      .catch(
        (error: unknown): Result<AuditLogApiRecordOutput[]> =>
          handleApiError(error, "getting messages", "getting messages")
      )
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

    const url = `${this.baseUrl}?${queryString}`

    return fetch(url, {
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      dispatcher: undiciDispatcher,
      headers: {
        ...this.apiKeyHeader
      },
      method: "GET",
      signal: this.signal
    })
      .then((response): Promise<Result<AuditLogApiRecordOutput[]>> | Result<AuditLogApiRecordOutput[]> => {
        if (response.ok) {
          return response.json()
        }

        if (response.status === HttpStatusCode.notFound) {
          return undefined as unknown as AuditLogApiRecordOutput[]
        }

        return response.text().then((text) => {
          return new ApplicationError(`Error getting message by hash: ${text}`, new Error(text))
        })
      })
      .catch(
        (error: unknown): Result<AuditLogApiRecordOutput[]> =>
          handleApiError(error, `getting message by hash: ${messageHash}`, "getting message by hash")
      )
  }

  retryEvent(correlationId: string): PromiseResult<void> {
    const url = `${this.baseUrl}/${correlationId}/retry`

    return fetch(url, {
      body: JSON.stringify({}),
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      dispatcher: undiciDispatcher,
      headers: {
        "Content-Type": "application/json",
        ...this.apiKeyHeader
      },
      method: "POST",
      signal: this.signal
    })
      .then((response) => {
        if (response.status === HttpStatusCode.noContent) {
          return
        }

        if (response.status === HttpStatusCode.notFound) {
          return new Error(`The message with Id ${correlationId} does not exist.`)
        }

        return response.text().then(() => {
          return new Error(`Error ${response.status}: Could not retry audit log event.`)
        })
      })
      .catch(
        (error: unknown): Result<void> =>
          handleApiError(error, `retrying event for message with Id ${correlationId}`, "retrying event")
      )
  }

  sanitiseAuditLog(correlationId: string): PromiseResult<void> {
    const url = `${this.baseUrl}/${correlationId}/sanitise`

    return fetch(url, {
      body: JSON.stringify({}),
      // @ts-expect-error - Required for Node.js environments (node-fetch/undici)
      dispatcher: undiciDispatcher,
      headers: {
        "Content-Type": "application/json",
        ...this.apiKeyHeader
      },
      method: "POST",
      signal: this.signal
    })
      .then((response) => {
        if (response.status === HttpStatusCode.noContent) {
          return
        }

        if (response.status === HttpStatusCode.notFound) {
          return new Error(`The message with Id ${correlationId} does not exist.`)
        }

        return response.text().then((text) => {
          return new ApplicationError(`Error from audit log api while sanitising: ${text}`, new Error(text))
        })
      })
      .catch((error: unknown): Result<void> => {
        const errorInstance = error instanceof Error ? error : new Error(String(error))
        return new ApplicationError(`Error sanitising message: ${errorInstance.message}`, errorInstance)
      })
  }

  private isB7Api(): boolean {
    return this.apiKey.startsWith("Bearer ")
  }

  private stringify(message: unknown): string {
    return typeof message === "string" ? message : JSON.stringify(message)
  }
}
