import { randomUUID } from "crypto"
import expect from "expect"
import { promises as fs } from "fs"
import type LedsMock from "../../types/LedsMock"
import type { LedsBichard, LedsMockOptions } from "../../types/LedsMock"
import type PoliceApi from "../../types/PoliceApi"
import type { MockAsnQueryParams } from "../../types/PoliceApi"
import addMockToLedsApi from "./addMockToLedsApi"
import addMockToLedsMockApi from "./addMockToLedsMockApi"
import LedsTestApiHelper from "./helpers/LedsTestApiHelper/LedsTestApiHelper"
import * as mockGenerators from "./mockGenerators"
import { generateAsnQuery } from "./mockGenerators/generateAsnQuery"
import MockServer from "./MockServer"

export class LedsApi implements PoliceApi {
  mocks: LedsMock[] = []
  private personId: string
  private reportId: string
  private courtCaseId: string
  readonly mockServerClient: MockServer
  readonly ledsTestApiHelper: LedsTestApiHelper

  constructor(private readonly bichard: LedsBichard) {
    if (this.bichard.config.realPNC) {
      this.ledsTestApiHelper = new LedsTestApiHelper(this.bichard)
    } else {
      this.mockServerClient = new MockServer(this.bichard.config.ledsApiUrl)
    }
  }

  prepareInputMessage(message: string) {
    if (!this.bichard.config.realPNC) {
      return Promise.resolve(message)
    }

    const asn = this.ledsTestApiHelper.arrestSummonsNumber?.replace(/\//g, "")
    const updatedMessage = message.replace(/(<.*:ProsecutorReference>).*?(<\/.*:ProsecutorReference>)/, `$1${asn}$2`)

    return Promise.resolve(updatedMessage)
  }

  createValidRecord: (record: string) => Promise<void>

  mockMissingDataForTest(): Promise<void> {
    return addMockToLedsMockApi(this.bichard)
  }

  mockDataForTest(): Promise<void> {
    return this.bichard.config.realPNC ? addMockToLedsApi(this.bichard) : addMockToLedsMockApi(this.bichard)
  }

  mockEnquiryFromNcm(ncmFile: string, options?: LedsMockOptions): LedsMock {
    const queryOptions = options ?? {}
    this.personId = queryOptions.personId ??= randomUUID()
    this.reportId = queryOptions.reportId ??= randomUUID()
    this.courtCaseId = queryOptions.courtCaseId ??= randomUUID()

    return mockGenerators.generateAsnQueryFromNcm(this.bichard, ncmFile, queryOptions)
  }

  mockAsnQuery(params: MockAsnQueryParams): LedsMock {
    this.personId = randomUUID()
    this.reportId = randomUUID()
    this.courtCaseId = randomUUID()

    return generateAsnQuery(
      params.response,
      params.count ?? 0,
      params.asn,
      this.personId,
      this.reportId,
      this.courtCaseId
    )
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

  async recordMocks(): Promise<void> {
    const mocks = await this.mockServerClient.fetchMocks()
    await fs.writeFile(`${this.bichard.outputDir}/mocks.json`, JSON.stringify(mocks))
  }

  async recordRequests(): Promise<void> {
    const requests = await this.mockServerClient.fetchRequests()
    await fs.writeFile(`${this.bichard.outputDir}/requests.json`, JSON.stringify(requests))
  }

  async checkMocks(): Promise<void> {
    if (this.bichard.config.realPNC) {
      const disposalHistory = await this.ledsTestApiHelper.fetchDisposalHistory()
      console.log(JSON.stringify(disposalHistory, null, 2))
      return
    }

    let expectationPaths: string[] = []
    for (let index = 0; index < 3; index++) {
      const unusedMocks = await this.mockServerClient.retrieveUnusedMocks()
      if (unusedMocks.length === 0) {
        return
      }

      expectationPaths = unusedMocks.map((unusedMock) => unusedMock.path)

      await new Promise((resolve) => setTimeout(resolve, 2_000))
    }

    throw Error(["Mocks not called:", ...expectationPaths].join("\n"))
  }

  async expectNoRequests(): Promise<void> {
    for (let index = 0; index < 2; index++) {
      const requests = await this.mockServerClient.fetchRequests()
      if (requests.length > 0) {
        expect(requests).toHaveLength(0)
      }

      await new Promise((resolve) => setTimeout(resolve, 2_000))
    }
  }

  async expectNoUpdates(): Promise<void> {
    for (let index = 0; index < 2; index++) {
      const updates = (await this.mockServerClient.fetchRequests()).filter((request) =>
        request.path.startsWith("/people/")
      )

      if (updates.length > 0) {
        expect(updates).toHaveLength(0)
      }

      await new Promise((resolve) => setTimeout(resolve, 2_000))
    }
  }

  async expectNotUpdated(): Promise<void> {
    for (let index = 0; index < 2; index++) {
      const updates = (await this.mockServerClient.fetchMocks()).filter(
        (mock) => mock.path.startsWith("/people/") && mock.hits > 0
      )

      if (updates.length > 0) {
        expect(updates).toHaveLength(0)
      }

      await new Promise((resolve) => setTimeout(resolve, 2_000))
    }
  }

  expectUpdateIncludes: (data: string) => Promise<void>
}
