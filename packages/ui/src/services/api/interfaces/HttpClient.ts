interface HttpClient {
  readonly jwt: string
  get: (route: string) => Promise<unknown | Error>
}

export default HttpClient
