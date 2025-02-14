interface HttpClient {
  readonly jwt: string
  get<T>(route: string): Promise<Error | T>
}

export default HttpClient
