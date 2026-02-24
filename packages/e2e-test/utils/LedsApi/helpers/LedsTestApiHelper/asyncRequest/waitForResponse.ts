import type { AxiosError } from "axios"
import axios, { HttpStatusCode } from "axios"
import https from "https"
import type RequestOptions from "../../../../../types/LedsTestApiHelper/RequestOptions"
import type { PendingRequestResponse } from "../../../../../types/LedsTestApiHelper/Requests/LedsAsyncRequest"
import { isError } from "../../../../isError"
import ApiError from "../ApiError"
import type { EndpointHeaders } from "../generateHeaders"
import generateHeaders from "../generateHeaders"

const wait = (delayInMs = 300) => new Promise((resolve) => setTimeout(resolve, delayInMs))

const waitForResponse = async (
  requestOptions: RequestOptions,
  urlPath: string,
  requestId: string,
  endpointHeaders: EndpointHeaders
): Promise<PendingRequestResponse> => {
  await wait(100)

  let counter = 0
  while (true) {
    const statusRequestHeaders = generateHeaders(endpointHeaders, requestOptions.authToken)
    const response = await axios
      .get<PendingRequestResponse>(`${requestOptions.baseUrl}/person-services/v1/status/${requestId}`, {
        headers: statusRequestHeaders,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
      .catch((error: AxiosError) => error)

    if (isError(response)) {
      if (response.response?.status === HttpStatusCode.NotFound) {
        await wait()
        continue
      }

      throw new ApiError(response)
    }

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`Failed to check status for GET ${urlPath}: ${response.status}, ${response.data}`)
    }

    const requestDetails = response.data
    if (requestDetails.status === "Completed") {
      return response.data
    }

    counter += 1

    if (counter === 10) {
      throw new Error(`Pending request didn't complete for ${urlPath}. ${JSON.stringify(response.data)}`)
    }

    await wait()
  }
}

export default waitForResponse
