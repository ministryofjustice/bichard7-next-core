import type { HttpRequest, HttpResponse } from "mockserver-client/mockServer"
import type { LedsApi } from "../utils/LedsApi"
import type Bichard from "../utils/world"
import type {
  PartialPoliceApiRequestMock,
  PoliceApiRequestMock,
  PoliceApiRequestMockQueryOptions,
  PoliceApiRequestMockUpdateOptions
} from "./PoliceApi"

export type LedsMockOptions = PoliceApiRequestMockQueryOptions & {
  personId?: string
  reportId?: string
  courtCaseIds?: string[]
}

export type LedsMockUpdateOptions = PoliceApiRequestMockUpdateOptions & {
  personId?: string
  reportId?: string
}

export type LedsMock = PartialPoliceApiRequestMock &
  PoliceApiRequestMock & {
    id: string
    request: HttpRequest
    response: HttpResponse
    count?: number
    expectedRequest?: string | object
  }

export type LedsBichard = Omit<Bichard, "policeApi"> & { policeApi: LedsApi }

export default LedsMock
