import { fetch, Agent } from "undici"
import { API_LOCATION } from "config"
import { randomUUID } from "crypto"
import apiLogger from "./apiLogger"

export default class ReportsApiClient {
  private readonly jwt: string
  private readonly dispatcher: Agent

  constructor(jwt: string) {
    this.jwt = jwt

    this.dispatcher = new Agent({
      connect: {
        rejectUnauthorized: false
      }
    })
  }

  async *fetchReport<T>(url: string): AsyncIterable<T | Error> {
    const traceId = randomUUID()
    const logger = apiLogger(traceId, url)

    try {
      const startTime = new Date().getTime()

      logger.info("Requesting reports")

      const requestUrl = `${API_LOCATION}${url}`

      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "x-trace-id": traceId
        },
        dispatcher: this.dispatcher
      })

      if (!response.ok) {
        logger.error("Error: stream error")

        yield new Error(`Stream failed: Request failed with status code ${response.status}, trace ID ${traceId}`)
        return
      }

      if (response.body) {
        for await (const chunk of response.body) {
          yield chunk as T
        }

        const duration = new Date().getTime() - startTime
        logger.info(`Success - Took ${duration}ms`)
      }
    } catch (err) {
      const error = err as Error

      logger.error(`Error: ${error.name}  ${error.message}`)

      yield error
    }
  }
}
