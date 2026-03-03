import type { AxiosError } from "axios"
import axios from "axios"
import https from "https"
import type DisposalHistoryResponse from "../../../../types/LedsTestApiHelper/DisposalHistoryResponse"
import type PersonDetails from "../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../types/LedsTestApiHelper/RequestOptions"
import { isError } from "../../../isError"
import ApiError from "./ApiError"
import generateHeaders, { ENDPOINT_HEADERS } from "./generateHeaders"

const fetchDisposalHistory = async (requestOptions: RequestOptions, person: PersonDetails) => {
  if (!person.personId) {
    throw Error("Person ID is missing. Person must be created first.")
  }

  const headers = generateHeaders(ENDPOINT_HEADERS.disposalHistory, requestOptions.authToken)
  const response = await axios
    .get<DisposalHistoryResponse>(
      `${requestOptions.baseUrl}/person-services/v1/people/${person.personId}/disposal-history`,
      {
        headers,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }
    )
    .catch((error: AxiosError) => error)

  if (isError(response)) {
    throw new ApiError(response)
  }

  return response.data
}

export default fetchDisposalHistory
