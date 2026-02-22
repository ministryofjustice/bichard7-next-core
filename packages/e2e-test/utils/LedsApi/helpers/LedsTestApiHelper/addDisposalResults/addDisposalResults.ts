import endpoints from "@moj-bichard7/core/lib/policeGateway/leds/endpoints"
import type { AxiosError } from "axios"
import axios from "axios"
import https from "https"
import type CourtCase from "../../../../../types/LedsTestApiHelper/CourtCase"
import type PersonDetails from "../../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../../types/LedsTestApiHelper/RequestOptions"
import { isError } from "../../../../isError"
import ApiError from "../ApiError"
import findDisposalsByAsn from "../findDisposalsByAsn"
import generateHeaders, { ENDPOINT_HEADERS } from "../generateHeaders"
import mapToAddDisposalResult from "./mapToAddDisposalResult"

const addDisposalResults = async (
  requestOptions: RequestOptions,
  person: PersonDetails,
  courtCase: CourtCase,
  arrestSummonsNumber: string
): Promise<void> => {
  if (!person.personId || !courtCase.courtCaseId) {
    throw Error("Person ID and Court case ID must be provided.")
  }

  const disposal = await findDisposalsByAsn(requestOptions, arrestSummonsNumber)
  const request = mapToAddDisposalResult(person, courtCase, disposal, requestOptions.checkName)

  const headers = generateHeaders(ENDPOINT_HEADERS.addDisposalResults, requestOptions.authToken)
  const url = `${requestOptions.baseUrl}/${endpoints.addDisposal(person.personId, courtCase.courtCaseId)}`
  const response = await axios
    .post(url, request, {
      headers,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    .catch((error: AxiosError) => error)

  if (isError(response)) {
    throw new ApiError(response)
  }
}

export default addDisposalResults
