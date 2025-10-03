import ApiClient from "services/api/ApiClient"

export default class FakeApiClient extends ApiClient {
  async get<T>(_route: string): Promise<Error | T> {
    return Promise.resolve(new Error())
  }

  async post<T>(_route: string, _data?: string | Record<string, unknown>): Promise<Error | T> {
    return Promise.resolve(new Error())
  }
}
