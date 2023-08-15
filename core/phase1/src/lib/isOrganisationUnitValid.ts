import type { OrganisationUnitCodes } from "core/phase1/src/types/AnnotatedHearingOutcome"
import lookupOrganisationUnitByCode from "../dataLookup/lookupOrganisationUnitByCode"
import populateOrganisationUnitFields from "./organisationUnit/populateOrganisationUnitFields"

const isOrganisationUnitValid = (organisationUnit?: OrganisationUnitCodes): boolean =>
  !!organisationUnit && !!lookupOrganisationUnitByCode(populateOrganisationUnitFields(organisationUnit))

export default isOrganisationUnitValid
