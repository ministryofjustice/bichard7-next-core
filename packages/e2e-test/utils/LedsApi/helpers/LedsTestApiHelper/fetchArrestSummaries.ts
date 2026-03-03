import type { AxiosError } from "axios"
import axios from "axios"
import https from "https"
import type ArrestSummariesResponse from "../../../../types/LedsTestApiHelper/ArrestSummariesResponse"
import type { ArrestSummaries } from "../../../../types/LedsTestApiHelper/ArrestSummariesResponse"
import type PersonDetails from "../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../types/LedsTestApiHelper/RequestOptions"
import { isError } from "../../../isError"
import ApiError from "./ApiError"
import generateHeaders, { ENDPOINT_HEADERS } from "./generateHeaders"

const fetchArrestSummaries = async (
  requestOptions: RequestOptions,
  person: PersonDetails
): Promise<ArrestSummaries[]> => {
  if (!person.personId) {
    throw Error("Person ID is missing. Person must be created first.")
  }

  const headers = generateHeaders(ENDPOINT_HEADERS.arrestSummaries, requestOptions.authToken)
  const response = await axios
    .get<ArrestSummariesResponse>(
      `${requestOptions.baseUrl}/person-services/v1/people/${person.personId}/arrest-reports?offset=0&limit=999`,
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

  return response.data.arrestSummaries
}

export default fetchArrestSummaries
