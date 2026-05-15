import type { MockAddDisposalRequest } from "./MockAddDisposalRequest"
import type { MockAsnQueryErrorResponse } from "./MockAsnQueryErrorResponse"
import type { MockAsnQueryResponse } from "./MockAsnQueryResponse"
import type { MockRemandRequest } from "./MockRemandRequest"
import type { MockSubsequentDisposalResultsRequest } from "./MockSubsequentDisposalResultsRequest"

export type PoliceApiRequestMockQueryOptions = {
  matchRegex?: string
  response?: string
  expectedRequest?: MockAddDisposalRequest | MockRemandRequest | MockSubsequentDisposalResultsRequest
  count?: number
}

export type PoliceApiRequestMockUpdateOptions = {
  matchRegex?: string
  response?: string
  expectedRequest?: MockAddDisposalRequest | MockRemandRequest | MockSubsequentDisposalResultsRequest
  count?: number
  courtCaseId?: string
}

export type PartialPoliceApiRequestMock = {}

export type PoliceApiRequestMock = PartialPoliceApiRequestMock & {}

export type MockAsnQueryParams = {
  matchRegex: string
  response: MockAsnQueryResponse | MockAsnQueryErrorResponse
  expectedRequest: string
  asn: string
  count?: number
}

export type PrepareInputMessageOptions = {
  useOriginalAsn: boolean
}

export default interface PoliceApi {
  mocks: PoliceApiRequestMock[]
  checkMocks: () => Promise<void>
  createValidRecord: (record: string) => Promise<void>
  mockMissingDataForTest: () => Promise<void>
  mockDataForTest: () => Promise<void>
  mockEnquiryFromNcm: (ncmFile: string, options?: PoliceApiRequestMockQueryOptions) => PartialPoliceApiRequestMock
  mockAsnQuery: (params: MockAsnQueryParams) => PartialPoliceApiRequestMock
  mockUpdate: (code: string, options?: PoliceApiRequestMockUpdateOptions) => PartialPoliceApiRequestMock
  generateDummyUpdate(): PartialPoliceApiRequestMock
  clearMocks(): Promise<void>
  recordMocks(): Promise<void>
  recordRequests(): Promise<void>
  expectNoRequests: () => Promise<void>
  expectNoUpdates: () => Promise<void>
  expectNotUpdated: () => Promise<void>
  expectUpdateIncludes: (data: string) => Promise<void>
  prepareInputMessage: (message: string, options: PrepareInputMessageOptions) => Promise<string>
  getAsn: () => string | undefined
}
