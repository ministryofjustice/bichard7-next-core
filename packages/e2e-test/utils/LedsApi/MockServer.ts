import axios from "axios"
import https from "https"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

type RequestResponseMock = {
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

  async retrieveUnusedMocks() {
    const mocksResponse = await axios.get(`${this.apiUrl}/mocks`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })

    const mocks = JSON.parse(mocksResponse.data) as RequestResponseMock[]

    return mocks.filter((mock) => !mock.request)
  }
}
