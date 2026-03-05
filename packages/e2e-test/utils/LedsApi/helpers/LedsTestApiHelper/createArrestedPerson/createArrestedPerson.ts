import type CourtCase from "../../../../../types/LedsTestApiHelper/CourtCase"
import type PersonDetails from "../../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../../types/LedsTestApiHelper/RequestOptions"
import asyncRequest from "../asyncRequest/asyncRequest"
import { ENDPOINT_HEADERS } from "../generateHeaders"
import mapToCreateArrestedPersonRequest from "./mapToCreateArrestedPersonRequest"

type CreateArrestedPersonResult = {
  arrestSummonsNumber: string
  arrestSummonsId: string
  personUrn: string
  personId: string
}

const createArrestedPerson = async (
  requestOptions: RequestOptions,
  person: PersonDetails,
  courtCases: CourtCase[]
): Promise<CreateArrestedPersonResult> => {
  const arrestedPersonRequest = mapToCreateArrestedPersonRequest(
    person,
    courtCases[0].offences[0],
    requestOptions.checkName
  )

  const createArrestedPersonResult = await asyncRequest<CreateArrestedPersonResult>(
    requestOptions,
    "person-services/v1/people/create-arrested-person",
    arrestedPersonRequest,
    ENDPOINT_HEADERS.createArrestedPerson
  )
  person.personId = createArrestedPersonResult.personId

  return createArrestedPersonResult
}

export default createArrestedPerson
