import type { AxiosError } from "axios"
import axios, { HttpStatusCode } from "axios"
import https from "https"
import path from "path"
import type RequestOptions from "../../../../../types/LedsTestApiHelper/RequestOptions"
import type { PendingRequest } from "../../../../../types/LedsTestApiHelper/Requests/LedsAsyncRequest"
import { isError } from "../../../../isError"
import ApiError from "../ApiError"
import type { EndpointHeaders } from "../generateHeaders"
import generateHeaders from "../generateHeaders"

const initiateRequest = async (
  requestOptions: RequestOptions,
  urlPath: string,
  body: unknown,
  endpointHeaders: EndpointHeaders
) => {
  const pendingRequestHeaders = generateHeaders(endpointHeaders, requestOptions.authToken)
  const url = `${requestOptions.baseUrl}/${urlPath}`

  const pendingRequestResponse = await axios
    .post<PendingRequest>(url, body, {
      headers: pendingRequestHeaders,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    .catch((error: AxiosError) => error)

  if (isError(pendingRequestResponse)) {
    throw new ApiError(pendingRequestResponse)
  }

  console.log(JSON.stringify(pendingRequestResponse.data))

  if (pendingRequestResponse.status !== HttpStatusCode.Accepted) {
    throw new Error(
      `Failed to send request to POST ${path.join(requestOptions.baseUrl, urlPath)}: ${pendingRequestResponse.status}, ${pendingRequestResponse.data}`
    )
  }

  const { requestId } = pendingRequestResponse.data

  return requestId
}

export default initiateRequest
