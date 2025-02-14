import { API_LOCATION } from "config"
import type HttpClient from "./interfaces/HttpClient"

enum Method {
  GET = "GET"
}

class ApiClient implements HttpClient {
  readonly jwt: string

  constructor(jwt: string) {
    this.jwt = jwt
  }

  async get(route: string): Promise<unknown> {
    const response = await this.useFetch(route, Method.GET)
    if (!response.ok) {
      return new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    return await response.json()
  }

  async useFetch(route: string, method: Method): Promise<Response> {
    return await fetch(`${API_LOCATION}${route}`, {
      headers: {
        Authorization: `Bearer ${this.jwt}`
      },
      method
    })
  }
}

export default ApiClient
