import axios from "axios"
import { promises as fs } from "fs"

import type { PncMock } from "../utils/pnc"
import type Bichard from "../utils/world"

import Poller from "../utils/Poller"

type MockPNCHelperOptions = {
  host: string
  port: number
  world?: Bichard
}

class MockPNCHelper {
  constructor(private options: MockPNCHelperOptions) {}

  async addMock(matchRegex: string, response: string, count: null | number = null): Promise<string> {
    const data = { count, matchRegex, response }
    const resp = await axios.post(`http://${this.options.host}:${this.options.port}/mocks`, data)
    if (resp.status < 200 || resp.status >= 300) {
      throw new Error("Error setting mock in PNC Emulator")
    }

    return resp.headers.location.replace("/mocks/", "")
  }

  awaitMockRequest(id: string, timeout = 40000) {
    const action = () => this.getMock(id)

    const condition = (mock: PncMock) => mock && mock.requests && mock.requests.length > 0

    const options = {
      condition,
      delay: 250,
      name: "Mock PNC request poller",
      timeout
    }
    return new Poller<PncMock>(action)
      .poll(options)
      .then((mock) => mock)
      .catch((error) => error)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkRecord(_specFolder: string): Promise<boolean> {
    throw new Error("checkRecord on MockPNCHelper should not be called")
  }

  async clearMocks() {
    const response = await axios.delete(`http://${this.options.host}:${this.options.port}/mocks`)
    if (response.status !== 204) {
      throw new Error("Error clearing mocks in PNC Emulator")
    }
  }

  async getMock(id: string): Promise<PncMock> {
    const resp = await axios.get(`http://${this.options.host}:${this.options.port}/mocks/${id}`, {
      validateStatus: () => true
    })
    if (resp.status < 200 || resp.status >= 300) {
      throw new Error("Error getting mock from PNC Emulator")
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

  async getRequests() {
    const resp = await axios.get(`http://${this.options.host}:${this.options.port}/requests`, {
      validateStatus: () => true
    })
    if (resp.status < 200 || resp.status >= 300) {
      throw new Error("Error getting requests from PNC Emulator")
    }

    return resp.data
  }

  async recordMocks() {
    const mocks = await this.getMocks()
    await fs.writeFile(`${this.options.world?.outputDir}/mocks.json`, JSON.stringify(mocks))
  }

  async recordRequests() {
    const requests = await this.getRequests()
    await fs.writeFile(`${this.options.world?.outputDir}/requests.json`, JSON.stringify(requests))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setupRecord(_specFolder: string) {
    throw new Error("setupRecord on MockPNCHelper should not be called")
  }
}

export default MockPNCHelper
