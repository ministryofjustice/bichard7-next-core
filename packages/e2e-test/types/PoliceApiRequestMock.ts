export type PoliceApiRequestMockOptions = {
  matchRegex?: string
  expectedRequest?: string
  count?: number
}

export type PartialPoliceApiRequestMock = {
  matchRegex: string
  response: string
  count?: number
  expectedRequest: string
}

type PoliceApiRequestMock = PartialPoliceApiRequestMock & {
  id: string
  requests: string[]
}

export default PoliceApiRequestMock
