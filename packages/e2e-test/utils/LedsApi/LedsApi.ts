import { mockServerClient, type MockServerClient } from "mockserver-client/mockServerClient"
import type LedsMock from "../../types/LedsMock"
import type { LedsBichard, LedsMockOptions } from "../../types/LedsMock"
import type PoliceApi from "../../types/PoliceApi"
import addMockToLedsMockApi from "./addMockToLedsMockApi"
import * as mockGenerators from "./mockGenerators"

export default class LedsApi implements PoliceApi {
  mocks: LedsMock[] = []
  readonly mockServerClient: MockServerClient

  constructor(private readonly bichard: LedsBichard) {
    const mockServerUrl = new URL(this.bichard.config.ledsApiUrl)
    this.mockServerClient = mockServerClient(mockServerUrl.hostname, Number(mockServerUrl.port))
  }

  checkMocks: () => Promise<void>

  createValidRecord: (record: string) => Promise<void>

  mockMissingDataForTest: () => Promise<void>

  mockDataForTest(): Promise<void> {
    return addMockToLedsMockApi(this.bichard)
  }

  mockEnquiryFromNcm(ncmFile: string, options?: LedsMockOptions): LedsMock {
    return mockGenerators.generateAsnQueryFromNcm(this.bichard, ncmFile, options)
  }

  mockUpdate(code: string, options?: LedsMockOptions): LedsMock {
    return mockGenerators.generateUpdate(code, options)
  }

  generateDummyUpdate(): LedsMock {
    return mockGenerators.generateDummyUpdate()
  }

  async clearMocks(): Promise<void> {
    await this.mockServerClient.clear("", "ALL")
  }

  recordMocks(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  recordRequests(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  expectNoRequests: () => Promise<void>

  expectNoUpdates: () => Promise<void>

  expectNotUpdated: () => Promise<void>

  expectUpdateIncludes: (data: string) => Promise<void>
}
