import { randomUUID } from "crypto"
import type LedsMock from "../../types/LedsMock"
import type { LedsBichard, LedsMockOptions } from "../../types/LedsMock"
import type PoliceApi from "../../types/PoliceApi"
import type { PartialPoliceApiRequestMock } from "../../types/PoliceApi"
import addMockToLedsMockApi from "./addMockToLedsMockApi"
import * as mockGenerators from "./mockGenerators"
import { generateAsnQuery } from "./mockGenerators/generateAsnQuery"
import MockServer from "./MockServer"

export class LedsApi implements PoliceApi {
  mocks: LedsMock[] = []
  private personId: string
  private reportId: string
  private courtCaseId: string
  readonly mockServerClient: MockServer

  constructor(private readonly bichard: LedsBichard) {
    this.mockServerClient = new MockServer(this.bichard.config.ledsApiUrl)
  }

  async checkMocks(): Promise<void> {
    const unusedMocks = await this.mockServerClient.retrieveUnusedMocks()
    if (unusedMocks.length === 0) {
      return
    }

    const expectationPaths = unusedMocks.map((unusedMock) => unusedMock.path)
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

  mockAsnQuery(params: {
    matchRegex: string
    response: string
    expectedRequest: string
    asn: string
    count: number
  }): PartialPoliceApiRequestMock {
    this.personId = randomUUID()
    this.reportId = randomUUID()
    this.courtCaseId = randomUUID()

    return generateAsnQuery(params.response, params.count, params.asn, this.personId, this.reportId, this.courtCaseId)
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
    await this.mockServerClient.clear()
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
