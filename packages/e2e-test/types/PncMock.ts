import type { PncApi } from "../utils/PncApi"
import type Bichard from "../utils/world"
import type { MockAddDisposalRequest } from "./MockAddDisposalRequest"
import type { MockRemandRequest } from "./MockRemandRequest"
import type { MockSubsequentDisposalResultsRequest } from "./MockSubsequentDisposalResultsRequest"
import type { PartialPoliceApiRequestMock, PoliceApiRequestMock, PoliceApiRequestMockOptions } from "./PoliceApi"

export type PncMockOptions = PoliceApiRequestMockOptions

export type PartialPncMock = PartialPoliceApiRequestMock & {
  matchRegex: string
  response: string
  count?: number
  expectedRequest: string | MockAddDisposalRequest | MockRemandRequest | MockSubsequentDisposalResultsRequest
}

export type PncBichard = Omit<Bichard, "policeApi"> & { policeApi: PncApi }

type PncMock = PoliceApiRequestMock &
  PartialPncMock & {
    id: string
    requests: string[]
  }

export default PncMock
