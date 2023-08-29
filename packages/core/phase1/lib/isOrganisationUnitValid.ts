import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import lookupOrganisationUnitByCode from "../dataLookup/lookupOrganisationUnitByCode"
import populateOrganisationUnitFields from "../lib/organisationUnit/populateOrganisationUnitFields"

const isOrganisationUnitValid = (organisationUnit?: OrganisationUnitCodes): boolean =>
  !!organisationUnit && !!lookupOrganisationUnitByCode(populateOrganisationUnitFields(organisationUnit))

export default isOrganisationUnitValid
