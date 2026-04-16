import type OffenceDetails from "../../../../../types/LedsTestApiHelper/OffenceDetails"
import type PersonDetails from "../../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../../types/LedsTestApiHelper/RequestOptions"
import asyncRequest from "../asyncRequest/asyncRequest"
import { ENDPOINT_HEADERS } from "../generateHeaders"
import mapToAddOffenceRequest from "./mapToAddOffenceRequest"

type AddOffenceResult = {
  chargeId: string
}

const addOffence = async (
  requestOptions: RequestOptions,
  person: PersonDetails,
  offence: OffenceDetails,
  arrestSummonsId: string
): Promise<string> => {
  if (!person.personId) {
    throw Error("Person ID is missing. Person must be created first.")
  }

  const offenceRequest = mapToAddOffenceRequest(offence, requestOptions.checkName)

  const { chargeId } = await asyncRequest<AddOffenceResult>(
    requestOptions,
    `person-services/v1/people/${person.personId}/arrest-reports/${arrestSummonsId}/offences`,
    offenceRequest,
    ENDPOINT_HEADERS.addOffence
  )

  return chargeId
}

export default addOffence
