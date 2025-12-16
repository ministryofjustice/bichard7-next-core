import type { RequestHeaders } from "@moj-bichard7/core/types/leds/RequestHeaders"
import type { HttpRequest } from "mockserver-client"

type CreateMockRequestOptions<T> = {
  headers?: Partial<RequestHeaders>
  path: string
} & (
  | {
      body: T
      exactBodyMatch: boolean
    }
  | {
      body?: undefined
      exactBodyMatch?: undefined
    }
)

const createMockRequest = <T>({ path, headers, body }: CreateMockRequestOptions<T>): HttpRequest => ({
  method: "POST",
  path,
  headers: headers ?? {
    Accept: "application/json",
    "X-Leds-Correlation-Id": [".*"]
  },
  body: body ?? {}
})

export default createMockRequest
