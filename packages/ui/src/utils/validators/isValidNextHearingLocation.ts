import type OrganisationUnitNameAndCode from "@/types/OrganisationUnitNameAndCode"

const isValidNextHearingLocation = (
  amendedNextHearingLocation: string | undefined,
  organisations: OrganisationUnitNameAndCode[]
): boolean => {
  if (!amendedNextHearingLocation) {
    return false
  }

  return organisations.some(({ fullOrganisationCode }) => amendedNextHearingLocation === fullOrganisationCode)
}

export default isValidNextHearingLocation
