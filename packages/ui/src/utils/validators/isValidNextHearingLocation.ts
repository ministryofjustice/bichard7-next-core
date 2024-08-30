import OrganisationUnitApiResponse from "types/OrganisationUnitApiResponse"

const isValidNextHearingLocation = (
  amendedNextHearingLocation: string | undefined,
  organisations: OrganisationUnitApiResponse
): boolean => {
  if (!amendedNextHearingLocation) {
    return false
  }

  return organisations.some(({ fullOrganisationCode }) => amendedNextHearingLocation === fullOrganisationCode)
}

export default isValidNextHearingLocation
