import type { OrganisationUnitCodes } from "types/AnnotatedHearingOutcome"
import lookupOrganisationUnitByCode from "phase1/dataLookup/lookupOrganisationUnitByCode"
import populateOrganisationUnitFields from "phase1/lib/organisationUnit/populateOrganisationUnitFields"

const isOrganisationUnitValid = (organisationUnit?: OrganisationUnitCodes): boolean =>
  !!organisationUnit && !!lookupOrganisationUnitByCode(populateOrganisationUnitFields(organisationUnit))

export default isOrganisationUnitValid
