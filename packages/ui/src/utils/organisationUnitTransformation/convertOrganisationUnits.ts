import type OrganisationUnitNameAndCode from "@/types/OrganisationUnitNameAndCode"
import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import {
  getFullOrganisationCode,
  getFullOrganisationName
} from "@moj-bichard7/common/utils/searchCourtOrganisationUnits"

export const convertOrganisationUnits = (organisationUnits: OrganisationUnit[]): OrganisationUnitNameAndCode[] => {
  return organisationUnits.map((ou) => ({
    fullOrganisationCode: getFullOrganisationCode(ou),
    fullOrganisationName: getFullOrganisationName(ou)
  }))
}
