import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import type { TriggerCode } from "../../types/TriggerCode"

enum IncludeExclude {
  include = "include",
  exclude = "exclude"
}

export type TriggerRule = {
  code?: TriggerCode
  rule: IncludeExclude
  organisationUnit: OrganisationUnitCodes
}
// populateOrganisationUnitFields
