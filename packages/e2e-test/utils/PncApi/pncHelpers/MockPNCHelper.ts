import axios from "axios"
import { promises as fs } from "fs"
import type PncHelper from "../../../types/PncHelper"
import type PncMock from "../../../types/PncMock"
import type { PncBichard } from "../../../types/PncMock"
import type PncRequestResponse from "../../../types/PncRequestResponse"
import Poller from "../../Poller"

type MockPNCHelperOptions = {
  bichard?: PncBichard
  host: string
  port: number
}

export class MockPNCHelper implements PncHelper {
  constructor(private options: MockPNCHelperOptions) {}

  async addMock(matchRegex: string, response: string, count: number | null = null): Promise<string> {
    const data = { matchRegex, response, count }
    const resp = await axios.post(`http://${this.options.host}:${this.options.port}/mocks`, data)
    if (resp.status < 200 || resp.status >= 300) {
      throw new Error("Error setting mock in PNC Emulator")
    }

    return resp.headers.location.replace("/mocks/", "")
  }

  async getMock(id: string): Promise<PncMock> {
    const resp = await axios.get(`http://${this.options.host}:${this.options.port}/mocks/${id}`, {
      validateStatus: () => true
    })
    if (resp.status < 200 || resp.status >= 300) {
      throw new Error("Error getting mock from PNC Emulator")
    }

    console.log("Got mock", resp.data)

    return resp.data
  }

  async getRequests(): Promise<PncRequestResponse[]> {
    const resp = await axios.get<PncRequestResponse[]>(`http://${this.options.host}:${this.options.port}/requests`, {
      validateStatus: () => true
    })
    if (resp.status < 200 || resp.status >= 300) {
      throw new Error("Error getting requests from PNC Emulator")
    }

    return resp.data
  }

  async getMocks() {
    const resp = await axios.get(`http://${this.options.host}:${this.options.port}/mocks`, {
      validateStatus: () => true
    })
    if (resp.status < 200 || resp.status >= 300) {
      throw new Error("Error getting requests from PNC Emulator")
    }

    return resp.data
  }

  awaitMockRequest = (id: string, timeout: number): Promise<PncMock | Error> => {
    const action = () => this.getMock(id)
    const condition = (mock: PncMock) => mock && mock.requests && mock.requests.length > 0
    const options = {
      condition,
      timeout,
      delay: 250,
      name: "Mock PNC request poller"
    }

    return new Poller(action).poll(options).catch((error: Error) => error)
  }

  async clearMocks() {
    const response = await axios.delete(`http://${this.options.host}:${this.options.port}/mocks`)
    if (response.status !== 204) {
      throw new Error("Error clearing mocks in PNC Emulator")
    }
  }

  async recordRequests() {
    const requests = await this.getRequests()
    await fs.writeFile(`${this.options.bichard?.outputDir}/requests.json`, JSON.stringify(requests))
  }

  async recordMocks() {
    const mocks = await this.getMocks()
    await fs.writeFile(`${this.options.bichard?.outputDir}/mocks.json`, JSON.stringify(mocks))
  }

  setupRecord(): Promise<void> {
    throw new Error("setupRecord on MockPNCHelper should not be called")
  }

  checkRecord(): Promise<boolean> {
    throw new Error("checkRecord on MockPNCHelper should not be called")
  }
}
