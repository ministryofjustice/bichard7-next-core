import { expect } from "expect"
import path from "path"
import type PncHelper from "../../types/PncHelper"
import type PoliceApi from "../../types/PoliceApi"
import type { PartialPoliceApiRequestMock, PoliceApiRequestMockOptions } from "../../types/PoliceApiRequestMock"
import defaults from "../defaults"
import type Bichard from "../world"
import { checkMocksForPncEmulator, checkMocksForRealPnc } from "./checkMocks"
import createValidRecord from "./createValidRecord"
import expectNotUpdated from "./expectNotUpdated"
import fetchMocks from "./fetchMocks"
import mockDataForTest from "./mockDataForTest"
import mockEnquiryFromNcm from "./mockEnquiryFromNcm"
import MockPNCHelper from "./pncHelpers/MockPNCHelper"
import PNCTestTool from "./pncHelpers/PNCTestTool"
import setupMockInPncEmulator from "./setupMockInPncEmulator"

export default class PncApi implements PoliceApi {
  private readonly pncHelper: PncHelper

  constructor(
    private readonly bichard: Bichard,
    private readonly skipPncValidation: boolean
  ) {
    this.pncHelper = this.bichard.config.realPNC
      ? new PNCTestTool({
          baseUrl: process.env.PNC_TEST_TOOL ?? ""
        })
      : new MockPNCHelper({
          host: process.env.PNC_HOST || defaults.pncHost,
          port: Number(process.env.PNC_PORT || defaults.pncPort),
          world: this.bichard
        })
  }

  checkMocks(): Promise<void> {
    return this.bichard.config.realPNC
      ? checkMocksForRealPnc(this.bichard, this.pncHelper)
      : checkMocksForPncEmulator(this.bichard, this.pncHelper)
  }

  createValidRecord(recordId: string): Promise<void> {
    return createValidRecord(this.bichard, this.pncHelper, recordId)
  }

  async mockMissingDataForTest(): Promise<void> {
    if (!this.bichard.config.realPNC) {
      const specFolder = path.dirname(this.bichard.featureUri)
      await setupMockInPncEmulator(this.bichard, this.pncHelper, specFolder)
    }
  }

  mockDataForTest(): Promise<"pending" | undefined> {
    return mockDataForTest(this.bichard, this.pncHelper, this.skipPncValidation)
  }

  async expectNoRequests(): Promise<void> {
    if (this.bichard.config.realPNC) {
      return
    }

    const requests = await this.pncHelper.getRequests()
    expect(requests.length).toEqual(0)
  }

  async expectNoUpdates(): Promise<void> {
    if (this.bichard.config.realPNC) {
      return
    }

    const requests = await this.pncHelper.getRequests()
    const updates = requests.filter((req: { request: string | string[] }) => req.request.includes("<CXU"))
    expect(updates.length).toEqual(0)
  }

  expectNotUpdated(): Promise<void> {
    return expectNotUpdated(this.bichard, this.pncHelper, this.skipPncValidation)
  }

  async expectUpdateIncludes(data: string): Promise<void> {
    if (this.bichard.config.realPNC) {
      return
    }

    await fetchMocks(this.bichard, this.pncHelper)
    const updateMocks = this.bichard.mocks.filter((mock) => mock.matchRegex.startsWith("CXU"))
    const checkedMocks = updateMocks.filter((mock) => mock.requests.length > 0 && mock.requests[0].includes(data))
    expect(checkedMocks.length).toEqual(1)
  }

  mockEnquiryFromNcm(ncmFile: string, options: PoliceApiRequestMockOptions): PartialPoliceApiRequestMock {
    return mockEnquiryFromNcm(this.bichard, ncmFile, options)
  }

  mockUpdate(code: string, options: PoliceApiRequestMockOptions): PartialPoliceApiRequestMock {
    const response = `<?XML VERSION="1.0" STANDALONE="YES"?>
    <${code}>
      <GMH>073GENL000001RNEWREMPNCA05A73000017300000120210415154673000001                                             09000${
        Math.floor(Math.random() * 8999) + 1000
      }</GMH>
      <TXT>A0031-REMAND REPORT HAS BEEN PROCESSED SUCCESSFULLY - ID: 00/263503N </TXT>
      <GMT>000003073GENL000001S</GMT>
    </${code}>`

    return {
      matchRegex: options.matchRegex || code,
      response,
      expectedRequest: options.expectedRequest || "",
      count: options.count || undefined
    }
  }

  clearMocks(): Promise<void> {
    return this.pncHelper.clearMocks()
  }

  recordMocks(): Promise<void> {
    return this.pncHelper.recordMocks()
  }

  recordRequests(): Promise<void> {
    return this.pncHelper.recordRequests()
  }
}
