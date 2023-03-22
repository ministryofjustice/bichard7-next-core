import { lookupOrganisationUnitByCode } from "src/dataLookup"
import type { OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"
import populateOrganisationUnitFields from "./organisationUnit/populateOrganisationUnitFields"

const isOrganisationUnitValid = (organisationUnit?: OrganisationUnitCodes): boolean =>
  !!organisationUnit && !!lookupOrganisationUnitByCode(populateOrganisationUnitFields(organisationUnit))

export default isOrganisationUnitValid
