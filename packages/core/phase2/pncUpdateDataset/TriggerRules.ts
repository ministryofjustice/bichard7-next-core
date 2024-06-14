import populateOrganisationUnitFields from "../../phase1/lib/organisationUnit/populateOrganisationUnitFields"
import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import { TriggerCode } from "../../types/TriggerCode"
import type { TriggerRule } from "../types/TriggerRule"
import { IncludeExclude } from "../types/TriggerRule"

export const TRIGGER_RULE_LIST: TriggerRule[] = [
  // trigger.rule.B772490.TRPR0014=exclude
  {
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "53" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "47" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR9993,
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "23" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPS0002,
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "86" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR9233,
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "53" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "47" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B77" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B772" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B7724" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B77249" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B772490" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR0014,
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B77" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR0014,
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B772" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR0014,
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B7724" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR0014,
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B77249" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR0014,
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B77290" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B78" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B782" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B7824" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B78249" } as OrganisationUnitCodes)
  },
  {
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B782490" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR0014,
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B78" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR0014,
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B782" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR0014,
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B7824" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR0014,
    rule: IncludeExclude.exclude,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B78249" } as OrganisationUnitCodes)
  },
  {
    code: TriggerCode.TRPR0014,
    rule: IncludeExclude.include,
    organisationUnit: populateOrganisationUnitFields({ OrganisationUnitCode: "B782490" } as OrganisationUnitCodes)
  }
]
