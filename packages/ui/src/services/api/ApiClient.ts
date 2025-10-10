import { API_LOCATION } from "config"

export enum HttpMethod {
  GET = "GET",
  POST = "POST"
}

class ApiClient {
  readonly jwt: string

  constructor(jwt: string) {
    this.jwt = jwt
  }

  async get<T>(route: string): Promise<Error | T> {
    const response = await this.useFetch(route, HttpMethod.GET)
    if (response.ok) {
      return await response.json()
    }

    return new Error(`Error: ${response.status} - ${response.statusText}`)
  }

  async post<T>(route: string, data?: string | Record<string, unknown>): Promise<Error | T> {
    const response = await this.useFetch(route, HttpMethod.POST, data)

    if (response.ok) {
      return await response.json()
    }

    return new Error(`Error: ${response.status} - ${response.statusText}`)
  }

  async useFetch(route: string, method: HttpMethod, bodyContent?: string | Record<string, unknown>): Promise<Response> {
    let body: string | Record<string, unknown> | undefined = undefined

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.jwt}`
    }

    if (bodyContent) {
      headers["Content-Type"] = "application/json"
      body = JSON.stringify(bodyContent)
    }

    return await fetch(`${API_LOCATION}${route}`, {
      headers,
      method,
      body
    })
  }
}

export default ApiClient
