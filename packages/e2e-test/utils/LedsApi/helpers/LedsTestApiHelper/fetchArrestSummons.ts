import type { AxiosError } from "axios"
import axios from "axios"
import https from "https"
import type ArrestSummonsResponse from "../../../../types/LedsTestApiHelper/ArrestSummonsResponse"
import type PersonDetails from "../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../types/LedsTestApiHelper/RequestOptions"
import { isError } from "../../../isError"
import ApiError from "./ApiError"
import generateHeaders, { ENDPOINT_HEADERS } from "./generateHeaders"

const fetchArrestSummons = async (
  requestOptions: RequestOptions,
  person: PersonDetails
): Promise<ArrestSummonsResponse> => {
  if (!person.personId) {
    throw Error("Person ID is missing. Person must be created first.")
  }

  const headers = generateHeaders(ENDPOINT_HEADERS.arrestSummons, requestOptions.authToken)
  const response = await axios
    .get<ArrestSummonsResponse>(
      `${requestOptions.baseUrl}/person-services/v1/people/${person.personId}/arrest-summons/COURT_CASE`,
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

export default fetchArrestSummons
