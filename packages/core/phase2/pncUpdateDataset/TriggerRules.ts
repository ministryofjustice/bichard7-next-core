import populateOrganisationUnitFields from "../../phase1/lib/organisationUnit/populateOrganisationUnitFields"
import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import type { TriggerRule } from "../types/TriggerRule"
import { IncludeExclude } from "../types/TriggerRule"

export const TRIGGER_RULE_LIST: TriggerRule[] = [
  // trigger.rule.B772490.TRPR0014=exclude
  {
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "53" } as OrganisationUnitCodes)
  }
]

// From old Bichard, triggers.properties:
// trigger.rule.23.TRPR9993=exclude
// trigger.rule.53=exclude
// trigger.rule.86.TRPS0002=Exclude
// trigger.rule.53.TRPR9233=include
// trigger.rule.47=include
// # Following rules added for testing br700002562
// trigger.rule.B77=include
// trigger.rule.B772=exclude
// trigger.rule.B7724=include
// trigger.rule.B77249=exclude
// trigger.rule.B772490=include
// trigger.rule.B77.TRPR0014=exclude
// trigger.rule.B772.TRPR0014=include
// trigger.rule.B7724.TRPR0014=exclude
// trigger.rule.B77249.TRPR0014=include
// trigger.rule.B772490.TRPR0014=exclude
// trigger.rule.B78=exclude
// trigger.rule.B782=include
// trigger.rule.B7824=exclude
// trigger.rule.B78249=include
// trigger.rule.B782490=exclude
// trigger.rule.B78.TRPR0014=include
// trigger.rule.B782.TRPR0014=exclude
// trigger.rule.B7824.TRPR0014=include
// trigger.rule.B78249.TRPR0014=exclude
// trigger.rule.B782490.TRPR0014=include
