import { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import OrganisationUnits from "@moj-bichard7-developers/bichard7-next-data/data/organisation-unit.json"
import { sortBy } from "lodash"

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

const courtOrganisationUnits: OrganisationUnit[] = OrganisationUnits.filter(
  (organisationUnit) => organisationUnit.topLevelName !== "Police Service" && /\S/.test(organisationUnit.thirdLevelName)
)

const sortedCourtOrganisationUnits = sortBy(
  courtOrganisationUnits,
  (organisationUnit) => organisationUnit.thirdLevelName
)

const searchCourtOrganisationUnits = (keyword: string): OrganisationUnit[] => {
  return keyword === ""
    ? []
    : sortedCourtOrganisationUnits.filter((organisationUnit) =>
        getOrganisationCodeAndName(organisationUnit).toLowerCase().includes(keyword.toLowerCase())
      )
}

export default searchCourtOrganisationUnits
