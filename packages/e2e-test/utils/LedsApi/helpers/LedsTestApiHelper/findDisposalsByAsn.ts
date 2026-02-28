import endpoints from "@moj-bichard7/core/lib/policeGateway/leds/endpoints"
import type { AsnQueryRequest } from "@moj-bichard7/core/types/leds/AsnQueryRequest"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { AxiosError } from "axios"
import axios from "axios"
import https from "https"
import type RequestOptions from "../../../../types/LedsTestApiHelper/RequestOptions"
import { isError } from "../../../isError"
import ApiError from "./ApiError"
import generateHeaders, { ENDPOINT_HEADERS } from "./generateHeaders"

const findDisposalsByAsn = async (
  requestOptions: RequestOptions,
  arrestSummonsNumber: string
): Promise<AsnQueryResponse> => {
  const request: AsnQueryRequest = {
    asn: arrestSummonsNumber,
    caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "court-case"]
  }
  const headers = generateHeaders(ENDPOINT_HEADERS.arrestSummaries, requestOptions.authToken)
  const response = await axios
    .post<AsnQueryResponse>(`${requestOptions.baseUrl}/${endpoints.asnQuery}`, request, {
      headers,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    .catch((error: AxiosError) => error)

  if (isError(response)) {
    throw new ApiError(response)
  }

  return response.data
}

export default findDisposalsByAsn
