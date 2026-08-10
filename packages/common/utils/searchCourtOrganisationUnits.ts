import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

import { sortBy } from "lodash"

// This regex matches the whole Organisation Unit Code and only takes the first part of
// E.g. B06OJ08 -> B06OJ
const ORGANISATION_UNIT_REGEX = /([a-z]\d{2}[a-z]{2})(?:\d{2})?/i

export const getFullOrganisationCode = (organisationUnit: OrganisationUnit) =>
  `${organisationUnit.topLevelCode}${organisationUnit.secondLevelCode}${organisationUnit.thirdLevelCode}${organisationUnit.bottomLevelCode}`

export const getFullOrganisationName = (organisationUnit: OrganisationUnit) =>
  [
    organisationUnit.topLevelName,
    organisationUnit.secondLevelName,
    organisationUnit.thirdLevelName,
    organisationUnit.bottomLevelName
  ]
    .filter((part) => !!part)
    .join(" ")

export const getOrganisationCodeAndName = (organisationUnit: OrganisationUnit) =>
  `${getFullOrganisationCode(organisationUnit)} ${getFullOrganisationName(organisationUnit)}`

const courtOrganisationUnits = (organisationUnits: OrganisationUnit[]) =>
  organisationUnits.filter(
    (organisationUnit) =>
      organisationUnit.topLevelName !== "Police Service" && /\S/.test(organisationUnit.thirdLevelName ?? "")
  )

export const sortCourtOrganisationUnits = (organisationUnits: OrganisationUnit[]) =>
  sortBy(courtOrganisationUnits(organisationUnits), (organisationUnit) => organisationUnit.thirdLevelName ?? "")

const findInSortedCourtOrganisationUnits = (keyword: string, organisationUnits: OrganisationUnit[]) =>
  organisationUnits.filter((organisationUnit) =>
    getOrganisationCodeAndName(organisationUnit).toLowerCase().includes(keyword.toLowerCase())
  )

const searchCourtOrganisationUnits = (keyword: string, organisationUnits: OrganisationUnit[]): OrganisationUnit[] => {
  if (keyword === "") {
    return organisationUnits
  }

  const matched = new RegExp(ORGANISATION_UNIT_REGEX).exec(keyword)

  if (matched && matched.length > 1) {
    return findInSortedCourtOrganisationUnits(matched[1], organisationUnits)
  }

  return findInSortedCourtOrganisationUnits(keyword, organisationUnits)
}

export default searchCourtOrganisationUnits
