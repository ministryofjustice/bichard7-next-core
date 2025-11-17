import type { PncApi } from "../utils/PncApi"
import type Bichard from "../utils/world"
import type { PartialPoliceApiRequestMock, PoliceApiRequestMock, PoliceApiRequestMockOptions } from "./PoliceApi"

export type PncMockOptions = PoliceApiRequestMockOptions & {
  matchRegex?: string
  expectedRequest?: string
  count?: number
}

export type PartialPncMock = PartialPoliceApiRequestMock & {
  matchRegex: string
  response: string
  count?: number
  expectedRequest: string
}

export type PncBichard = Omit<Bichard, "policeApi"> & { policeApi: PncApi }

type PncMock = PoliceApiRequestMock &
  PartialPncMock & {
    id: string
    requests: string[]
  }

export default PncMock
