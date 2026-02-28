import type OffenceIdAndVersion from "../../../../types/LedsTestApiHelper/OffenceIdAndVersion"
import type PersonDetails from "../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../types/LedsTestApiHelper/RequestOptions"
import fetchArrestSummaries from "./fetchArrestSummaries"
import fetchOffenceVersion from "./fetchOffenceVersion"

const fetchFirstOffenceDetails = async (
  requestOptions: RequestOptions,
  person: PersonDetails,
  arrestSummonsId: string
): Promise<OffenceIdAndVersion> => {
  const arrestSummaries = await fetchArrestSummaries(requestOptions, person)
  const offenceId = arrestSummaries[0].offencesHeadlines[0].offenceId
  const version = await fetchOffenceVersion(requestOptions, person, arrestSummonsId, offenceId)

  return { offenceId, version }
}

export default fetchFirstOffenceDetails
