export type PoliceApiRequestMockOptions = {}

export type PartialPoliceApiRequestMock = {}

export type PoliceApiRequestMock = PartialPoliceApiRequestMock & {}

export default interface PoliceApi {
  mocks: PoliceApiRequestMock[]
  checkMocks: () => Promise<void>
  createValidRecord: (record: string) => Promise<void>
  mockMissingDataForTest: () => Promise<void>
  mockDataForTest: () => Promise<void>
  mockEnquiryFromNcm: (ncmFile: string, options?: PoliceApiRequestMockOptions) => PartialPoliceApiRequestMock
  mockUpdate: (code: string, options?: PoliceApiRequestMockOptions) => PartialPoliceApiRequestMock
  generateDummyUpdate(): PartialPoliceApiRequestMock
  clearMocks(): Promise<void>
  recordMocks(): Promise<void>
  recordRequests(): Promise<void>
  expectNoRequests: () => Promise<void>
  expectNoUpdates: () => Promise<void>
  expectNotUpdated: () => Promise<void>
  expectUpdateIncludes: (data: string) => Promise<void>
}
