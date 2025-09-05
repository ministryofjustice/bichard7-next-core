import { expect } from "expect"
import type PncHelper from "../../types/PncHelper"
import type PncMock from "../../types/PncMock"
import type { PartialPncMock, PncBichard, PncMockOptions } from "../../types/PncMock"
import type PoliceApi from "../../types/PoliceApi"
import defaults from "../defaults"
import addMockToPncEmulator from "./addMockToPncEmulator"
import addMockToPncTestTool from "./addMockToPncTestTool"
import { checkMocksForPncEmulator, checkMocksForRealPnc } from "./checkMocks"
import createValidRecord from "./createValidRecord"
import expectNotUpdated from "./expectNotUpdated"
import fetchMocks from "./fetchMocks"
import { generateDummyUpdate, generateEnquiryFromNcm, generateUpdate } from "./mockGenerators"
import MockPNCHelper from "./pncHelpers/MockPNCHelper"
import PNCTestTool from "./pncHelpers/PNCTestTool"

export default class PncApi implements PoliceApi {
  mocks: PncMock[] = []

  private readonly pncHelper: PncHelper

  constructor(
    private readonly bichard: PncBichard,
    private readonly skipPncValidation: boolean
  ) {
    this.pncHelper = this.bichard.config.realPNC
      ? new PNCTestTool({
          baseUrl: process.env.PNC_TEST_TOOL ?? "",
          bichard: this.bichard
        })
      : new MockPNCHelper({
          host: process.env.PNC_HOST || defaults.pncHost,
          port: Number(process.env.PNC_PORT || defaults.pncPort),
          bichard: this.bichard
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
      await addMockToPncEmulator(this.bichard, this.pncHelper)
    }
  }

  mockDataForTest(): Promise<void> {
    if (this.bichard.config.realPNC) {
      return addMockToPncTestTool(this.bichard, this.pncHelper, this.skipPncValidation)
    }

    return addMockToPncEmulator(this.bichard, this.pncHelper)
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
    const updateMocks = this.mocks.filter((mock) => mock.matchRegex.startsWith("CXU"))
    const checkedMocks = updateMocks.filter((mock) => mock.requests.length > 0 && mock.requests[0].includes(data))
    expect(checkedMocks.length).toEqual(1)
  }

  mockEnquiryFromNcm(ncmFile: string, options?: PncMockOptions): PartialPncMock {
    return generateEnquiryFromNcm(this.bichard, ncmFile, options)
  }

  mockUpdate(code: string, options?: PncMockOptions): PartialPncMock {
    return generateUpdate(code, options)
  }

  generateDummyUpdate(): PartialPncMock {
    return generateDummyUpdate()
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
