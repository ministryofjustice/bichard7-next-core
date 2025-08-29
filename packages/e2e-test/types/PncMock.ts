export type PncMockWithoutIdAndRequests = {
  matchRegex: string
  response: string
  count: number
  expectedRequest: string
}

type PncMock = PncMockWithoutIdAndRequests & {
  id: string
  requests: string[]
}

export default PncMock
