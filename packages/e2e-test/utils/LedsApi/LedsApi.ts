import type PoliceApi from "../../types/PoliceApi"
import type { PartialPoliceApiRequestMock, PoliceApiRequestMockOptions } from "../../types/PoliceApiRequestMock"
import type Bichard from "../world"

export default class LedsApi implements PoliceApi {
  constructor(private readonly bichard: Bichard) {
    this.bichard.log("Not yet implemented")
  }

  checkMocks: () => Promise<void>
  createValidRecord: (record: string) => Promise<void>
  mockMissingDataForTest: () => Promise<void>
  mockDataForTest: () => Promise<"pending" | undefined>
  mockEnquiryFromNcm: (ncmFile: string, options?: PoliceApiRequestMockOptions) => PartialPoliceApiRequestMock
  mockUpdate: (code: string, options?: PoliceApiRequestMockOptions) => PartialPoliceApiRequestMock
  generateDummyUpdate: () => PartialPoliceApiRequestMock
  clearMocks(): Promise<void> {
    throw new Error("Method not implemented.")
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
