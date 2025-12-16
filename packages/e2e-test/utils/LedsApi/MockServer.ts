import axios from "axios"
import https from "https"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

export type RequestResponseMock = {
  method: "GET" | "POST" | "PUT"
  path: string
  response: {
    status: number
    body: Record<string, unknown>
    headers: Record<string, string>
  }
  request?: Record<string, unknown>
}

export default class MockServer {
  constructor(private readonly apiUrl: string) {}

  clear() {
    return axios.post(`${this.apiUrl}/clear`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
  }

  addMock(mock: RequestResponseMock) {
    return axios.post(`${this.apiUrl}/mocks`, mock, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
  }

  async fetchMocks(): Promise<RequestResponseMock[]> {
    const mocksResponse = await axios.get<RequestResponseMock[]>(`${this.apiUrl}/mocks`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })

    return mocksResponse.data
  }

  async retrieveUnusedMocks(): Promise<RequestResponseMock[]> {
    const mocks = await this.fetchMocks()

    return mocks.filter((mock) => !mock.request)
  }

  async fetchRequests(): Promise<RequestResponseMock[]> {
    const response = await axios.get<RequestResponseMock[]>(`${this.apiUrl}/requests`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })

    const ignoredPaths = ["/clear", "/mocks", "/requests"]

    return response.data.filter((request) => !ignoredPaths.includes(request.path))
  }
}
