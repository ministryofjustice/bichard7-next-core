import axios from "axios"
import https from "https"

export type RequestResponseMock = {
  method: "GET" | "POST" | "PUT"
  path: string
  requestBody: unknown
  response: {
    status: number
    body: Record<string, unknown>
    headers: Record<string, string>
  }
  request?: Record<string, unknown>
  hits: number
  count?: number
}

export default class MockServer {
  constructor(private readonly apiUrl: string) {}

  clear() {
    return axios.post(
      `${this.apiUrl}/clear`,
      {},
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }
    )
  }

  addMock(mock: Omit<RequestResponseMock, "hits">) {
    return axios.post(`${this.apiUrl}/mocks`, mock, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
  }

  async fetchMocks(): Promise<RequestResponseMock[]> {
    const mocksResponse = await axios.get<RequestResponseMock[]>(`${this.apiUrl}/mocks?output=json`, {
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
    const response = await axios.get<RequestResponseMock[]>(`${this.apiUrl}/requests?output=json`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })

    return response.data
  }
}
