import type { OrganisationUnitCodes } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import lookupOrganisationUnitByCode from "@moj-bichard7/common/aho/dataLookup/lookupOrganisationUnitByCode"

import populateOrganisationUnitFields from "../lib/organisationUnit/populateOrganisationUnitFields"

const isOrganisationUnitValid = (organisationUnit?: OrganisationUnitCodes): boolean =>
  !!organisationUnit && !!lookupOrganisationUnitByCode(populateOrganisationUnitFields(organisationUnit))

export default isOrganisationUnitValid
