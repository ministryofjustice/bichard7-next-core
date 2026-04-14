import { fetch, Agent } from "undici"
import { API_LOCATION } from "config"

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
    try {
      const requestUrl = `${API_LOCATION}${url}`

      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.jwt}`
        },
        dispatcher: this.dispatcher
      })

      if (!response.ok) {
        yield new Error(`Stream failed: Request failed with status code ${response.status}`)
        return
      }

      if (response.body) {
        for await (const chunk of response.body) {
          yield chunk as T
        }
      }
    } catch (error) {
      yield error as Error
    }
  }
}
