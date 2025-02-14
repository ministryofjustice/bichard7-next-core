interface HttpClient {
  readonly jwt: string
  get: (route: string) => Promise<unknown>
}

export default HttpClient
