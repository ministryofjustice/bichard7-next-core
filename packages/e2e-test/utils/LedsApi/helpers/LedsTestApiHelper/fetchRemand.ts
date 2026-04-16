import type { AxiosError } from "axios"
import axios from "axios"
import https from "https"
import type PersonDetails from "../../../../types/LedsTestApiHelper/PersonDetails"
import type RemandResponse from "../../../../types/LedsTestApiHelper/RemandResponse"
import type RequestOptions from "../../../../types/LedsTestApiHelper/RequestOptions"
import { isError } from "../../../isError"
import ApiError from "./ApiError"
import generateHeaders, { ENDPOINT_HEADERS } from "./generateHeaders"

const fetchRemand = async (
  requestOptions: RequestOptions,
  person: PersonDetails,
  arrestSummonsId: string,
  remandId: string
) => {
  if (!person.personId) {
    throw Error("Person ID is missing. Person must be created first.")
  }

  const headers = generateHeaders(ENDPOINT_HEADERS.remandDetails, requestOptions.authToken)
  const response = await axios
    .get<RemandResponse>(
      `${requestOptions.baseUrl}/person-services/v1/people/${person.personId}/arrest-reports/${arrestSummonsId}/remands/${remandId}`,
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

export default fetchRemand
