import { API_LOCATION } from "config"
import { ApiError } from "types/ApiError"
import type PromiseResult from "types/PromiseResult"
import { Agent, fetch } from "undici"
import { randomUUID } from "crypto"
import apiLogger from "./apiLogger"

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT"
}

const agent = new Agent({
  connect: {
    rejectUnauthorized: false
  }
})

class ApiClient {
  readonly jwt: string

  constructor(jwt: string) {
    this.jwt = jwt
  }

  async get<T>(route: string, additionalHeaders: Record<string, unknown> = {}): Promise<Error | T> {
    return await this.callApi(route, HttpMethod.GET, {}, additionalHeaders)
  }

  async post<T>(route: string, data?: string | Record<string, unknown>): Promise<Error | T> {
    return await this.callApi(route, HttpMethod.POST, data)
  }

  async put<T>(route: string, data?: string | Record<string, unknown>): Promise<Error | T> {
    return await this.callApi(route, HttpMethod.PUT, data)
  }

  async callApi<T>(
    route: string,
    method: HttpMethod,
    bodyContent: string | Record<string, unknown> = {},
    additionalHeaders: Record<string, unknown> = {}
  ): PromiseResult<T> {
    const traceId = randomUUID()
    const logger = apiLogger(traceId, route)
    const startTime = new Date().getTime()

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.jwt}`,
      "Content-Type": "application/json",
      "x-trace-id": traceId,
      ...additionalHeaders
    }

    const url = `${API_LOCATION}${route}`

    const requestOptions: Parameters<typeof fetch>[1] = {
      method,
      headers,
      dispatcher: agent
    }

    if (method !== HttpMethod.GET) {
      requestOptions.body = typeof bodyContent === "string" ? bodyContent : JSON.stringify(bodyContent)
    }

    logger.info("Requesting")

    try {
      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        const rawBody = await response.text()
        let message = rawBody

        try {
          const json = JSON.parse(rawBody)
          message = json?.message ?? rawBody
        } catch {
          // No op
        }

        logger.error(`Error: ${message}`)

        return new ApiError(response.status, `${message} - Trace ID ${traceId}`)
      }

      const duration = new Date().getTime() - startTime
      logger.info(`Success - Took ${duration}ms`)

      return (await response.json()) as T
    } catch (err) {
      const error = err as Error

      logger.error(`Error: ${error.name}  ${error.message}`)

      return error
    }
  }
}

export default ApiClient
