import type RequestOptions from "../../../../../types/LedsTestApiHelper/RequestOptions"
import type { EndpointHeaders } from "../generateHeaders"
import initiateRequest from "./initiateRequest"
import mapToResult from "./mapToResult"
import waitForResponse from "./waitForResponse"

const asyncRequest = async <T>(
  requestOptions: RequestOptions,
  urlPath: string,
  body: unknown,
  endpointHeaders: EndpointHeaders
): Promise<T> => {
  const requestId = await initiateRequest(requestOptions, urlPath, body, endpointHeaders)
  const requestStatus = await waitForResponse(requestOptions, urlPath, requestId, endpointHeaders)

  return mapToResult<T>(requestStatus)
}

export default asyncRequest
