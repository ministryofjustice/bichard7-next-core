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

  async useFetch(route: string, method: HttpMethod, body?: string | Record<string, unknown>): Promise<Response> {
    return await fetch(`${API_LOCATION}${route}`, {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
        "Content-Type": "application/json"
      },
      method,
      body: body ? JSON.stringify(body) : undefined
    })
  }
}

export default ApiClient
