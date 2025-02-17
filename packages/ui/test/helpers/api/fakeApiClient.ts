import ApiClient from "services/api/ApiClient"

export default class FakeApiClient extends ApiClient {
  async get<T>(_route: string): Promise<Error | T> {
    return Promise.resolve(new Error())
  }
}
