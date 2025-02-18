import { API_LOCATION } from "config"

export enum HttpMethod {
  GET = "GET"
}

class ApiClient {
  readonly jwt: string

  constructor(jwt: string) {
    this.jwt = jwt
  }

  async get<T>(route: string): Promise<Error | T> {
    const response = await this.useFetch(route, HttpMethod.GET)
    if (!response.ok) {
      return new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    return await response.json()
  }

  async useFetch(route: string, method: HttpMethod): Promise<Response> {
    return await fetch(`${API_LOCATION}${route}`, {
      headers: {
        Authorization: `Bearer ${this.jwt}`
      },
      method
    })
  }
}

export default ApiClient
