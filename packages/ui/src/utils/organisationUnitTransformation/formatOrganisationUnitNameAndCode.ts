import type OrganisationUnitNameAndCode from "@/types/OrganisationUnitNameAndCode"
import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import {
  getFullOrganisationCode,
  getFullOrganisationName
} from "@moj-bichard7/common/utils/searchCourtOrganisationUnits"
import { sortBy } from "lodash"

export const formatUnitOrganisationNameAndCode = (
  organisationUnits: OrganisationUnit[]
): OrganisationUnitNameAndCode[] => {
  const filtered = organisationUnits.filter(
    (organisationUnit) =>
      organisationUnit.topLevelName !== "Police Service" && /\S/.test(organisationUnit.thirdLevelName ?? "")
  )

  const sorted = sortBy(filtered, (organisationUnit) => organisationUnit.thirdLevelName)

  return sorted.map((ou) => ({
    fullOrganisationCode: getFullOrganisationCode(ou),
    fullOrganisationName: getFullOrganisationName(ou)
  }))
}
