import type OrganisationUnitNameAndCode from "@/types/OrganisationUnitNameAndCode"

// This regex matches the whole Organisation Unit Code and only takes the first part of
// E.g. B06OJ08 -> B06OJ
const ORGANISATION_UNIT_REGEX = /([a-z]\d{2}[a-z]{2})(?:\d{2})?/i

const filterOrganisationUnits = (keyword: string, organisationUnits: OrganisationUnitNameAndCode[]) =>
  organisationUnits.filter((organisationUnit) =>
    `${organisationUnit.fullOrganisationCode} ${organisationUnit.fullOrganisationName}`
      .toLowerCase()
      .includes(keyword.toLowerCase())
  )

export const searchOrganisationUnits = (
  keyword: string,
  organisationUnits: OrganisationUnitNameAndCode[]
): OrganisationUnitNameAndCode[] => {
  if (keyword === "") {
    return organisationUnits
  }

  const matched = new RegExp(ORGANISATION_UNIT_REGEX).exec(keyword)

  if (matched && matched.length > 1) {
    return filterOrganisationUnits(matched[1], organisationUnits)
  }

  return filterOrganisationUnits(keyword, organisationUnits)
}
