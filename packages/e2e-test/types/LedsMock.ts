import type { HttpRequest, HttpResponse } from "mockserver-client/mockServer"
import type { LedsApi } from "../utils/LedsApi"
import type Bichard from "../utils/world"
import type { PartialPoliceApiRequestMock, PoliceApiRequestMock, PoliceApiRequestMockOptions } from "./PoliceApi"

export type LedsMockOptions = PoliceApiRequestMockOptions & {
  count?: number
  personId?: string
  reportId?: string
  courtCaseId?: string
  response?: string
}

export type LedsMock = PartialPoliceApiRequestMock &
  PoliceApiRequestMock & {
    id: string
    request: HttpRequest
    response: HttpResponse
    count?: number
    receivedRequests: []
  }

export type LedsBichard = Omit<Bichard, "policeApi"> & { policeApi: LedsApi }

export default LedsMock
