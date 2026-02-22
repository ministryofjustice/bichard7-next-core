import type { AxiosError } from "axios"
import axios from "axios"
import https from "https"
import type PersonDetails from "../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../types/LedsTestApiHelper/RequestOptions"
import { isError } from "../../../isError"
import ApiError from "./ApiError"
import generateHeaders, { ENDPOINT_HEADERS } from "./generateHeaders"

const fetchOffenceVersion = async (
  requestOptions: RequestOptions,
  person: PersonDetails,
  arrestSummonsId: string,
  offenceId: string
) => {
  if (!person.personId) {
    throw Error("Person ID is missing. Person must be created first.")
  }

  const headers = generateHeaders(ENDPOINT_HEADERS.offenceLoop, requestOptions.authToken)
  const response = await axios
    .get<{ version: string }>(
      `${requestOptions.baseUrl}/person-services/v1/people/${person.personId}/arrest-reports/${arrestSummonsId}/offences/${offenceId}`,
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

  return response.data.version
}

export default fetchOffenceVersion
