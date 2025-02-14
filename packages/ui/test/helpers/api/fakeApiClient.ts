import type HttpClient from "../../../src/services/api/interfaces/HttpClient"

export default class FakeApiClient implements HttpClient {
  readonly jwt: string

  constructor(jwt: string) {
    this.jwt = jwt
  }

  async get<T>(_route: string): Promise<Error | T> {
    return Promise.resolve(new Error())
  }
}
