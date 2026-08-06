import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

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
