import axios from "axios"
import https from "node:https"

import { API_LOCATION } from "config"

export enum HttpMethod {
  GET = "GET",
  POST = "POST"
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

class ApiClient {
  readonly jwt: string

  constructor(jwt: string) {
    this.jwt = jwt
  }

  async get<T>(route: string): Promise<Error | T> {
    return await this.callApi(route, HttpMethod.GET)
  }

  async post<T>(route: string, data?: string | Record<string, unknown>): Promise<Error | T> {
    return await this.callApi(route, HttpMethod.POST, data)
  }

  async callApi<T>(
    route: string,
    method: HttpMethod,
    bodyContent: string | Record<string, unknown> = {}
  ): Promise<Error | T> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.jwt}`
    }

    try {
      const response = await axios({
        url: `${API_LOCATION}${route}`,
        method,
        headers,
        data: method === HttpMethod.GET ? undefined : bodyContent,
        httpsAgent
      })

      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message
        return new Error(err.response?.status + (msg ? " " + msg : ""))
      }

      return err as Error
    }
  }
}

export default ApiClient
