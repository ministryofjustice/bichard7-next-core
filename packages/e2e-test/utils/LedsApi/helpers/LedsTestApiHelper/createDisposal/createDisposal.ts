import type CourtCase from "../../../../../types/LedsTestApiHelper/CourtCase"
import type OffenceIdAndVersion from "../../../../../types/LedsTestApiHelper/OffenceIdAndVersion"
import type PersonDetails from "../../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../../types/LedsTestApiHelper/RequestOptions"
import addDisposalResults from "../addDisposalResults/addDisposalResults"
import asyncRequest from "../asyncRequest/asyncRequest"
import { ENDPOINT_HEADERS } from "../generateHeaders"
import mapToCreateDisposalRequest from "./mapToCreateDisposalRequest"

type CreateDisposalResult = {
  courtCaseId: string
}

const createDisposal = async (
  requestOptions: RequestOptions,
  person: PersonDetails,
  courtCase: CourtCase,
  linkedOffences: OffenceIdAndVersion[],
  arrestSummonsNumber: string
): Promise<void> => {
  const disposalRequest = mapToCreateDisposalRequest(
    courtCase,
    linkedOffences,
    person.forceOwnerCode,
    requestOptions.checkName
  )
  const { courtCaseId } = await asyncRequest<CreateDisposalResult>(
    requestOptions,
    `person-services/v1/people/${person.personId}/disposals`,
    disposalRequest,
    ENDPOINT_HEADERS.disposals
  )

  courtCase.courtCaseId = courtCaseId

  if (courtCase.offences.every((offence) => offence.results.length === 0)) {
    return
  }

  await addDisposalResults(requestOptions, person, courtCase, arrestSummonsNumber)
}

export default createDisposal
