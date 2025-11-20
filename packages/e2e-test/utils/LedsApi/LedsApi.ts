import { randomUUID } from "crypto"
import { mockServerClient, type MockServerClient } from "mockserver-client/mockServerClient"
import type LedsMock from "../../types/LedsMock"
import type { LedsBichard, LedsMockOptions } from "../../types/LedsMock"
import type PoliceApi from "../../types/PoliceApi"
import addMockToLedsMockApi from "./addMockToLedsMockApi"
import * as mockGenerators from "./mockGenerators"

export class LedsApi implements PoliceApi {
  mocks: LedsMock[] = []
  private personId: string
  private reportId: string
  private courtCaseId: string

  readonly mockServerClient: MockServerClient

  constructor(private readonly bichard: LedsBichard) {
    const mockServerUrl = new URL(this.bichard.config.ledsApiUrl)
    this.mockServerClient = mockServerClient(mockServerUrl.hostname, Number(mockServerUrl.port))
  }

  async checkMocks(): Promise<void> {
    const expectations = await this.mockServerClient.retrieveActiveExpectations({})
    if (expectations.length === 0) {
      return
    }

    const expectationPaths = expectations
      .map(
        (expectation) => expectation.httpRequest && "path" in expectation.httpRequest && expectation.httpRequest.path
      )
      .filter(Boolean)
    throw Error(["Mocks not called:", ...expectationPaths].join("\n"))
  }

  createValidRecord: (record: string) => Promise<void>

  mockMissingDataForTest: () => Promise<void>

  mockDataForTest(): Promise<void> {
    return addMockToLedsMockApi(this.bichard)
  }

  mockEnquiryFromNcm(ncmFile: string, options?: LedsMockOptions): LedsMock {
    const queryOptions = options ?? {}
    this.personId = queryOptions.personId ??= randomUUID()
    this.reportId = queryOptions.reportId ??= randomUUID()
    this.courtCaseId = queryOptions.courtCaseId ??= randomUUID()

    return mockGenerators.generateAsnQueryFromNcm(this.bichard, ncmFile, queryOptions)
  }

  mockUpdate(code: string, options?: LedsMockOptions): LedsMock {
    const updateOptions = options ?? {}
    updateOptions.personId ??= this.personId
    updateOptions.reportId ??= this.reportId
    updateOptions.courtCaseId ??= this.courtCaseId

    return mockGenerators.generateUpdate(code, updateOptions)
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
