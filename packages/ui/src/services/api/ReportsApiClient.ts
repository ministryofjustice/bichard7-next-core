import https from "node:https"
import type { AxiosInstance, AxiosRequestConfig } from "axios"
import axios from "axios"
import { API_LOCATION } from "config"

export default class ReportsApiClient {
  readonly client: AxiosInstance
  private readonly jwt: string

  constructor(jwt: string) {
    this.jwt = jwt

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    })

    this.client = axios.create({
      baseURL: API_LOCATION,
      httpsAgent,
      headers: {
        Authorization: `Bearer ${this.jwt}`
      }
    })
  }

  async *fetchReport<T>(url: string, config?: AxiosRequestConfig): AsyncIterable<T | Error> {
    try {
      const response = await this.client.get(url, {
        ...config,
        responseType: "stream"
      })

      for await (const chunk of response.data) {
        yield chunk
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        yield new Error(`Stream failed: ${error.message}`)
      } else {
        yield error as Error
      }
    }
  }
}
