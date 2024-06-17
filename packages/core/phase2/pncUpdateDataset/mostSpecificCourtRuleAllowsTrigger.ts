import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

const mostSpecificCourtRuleAllowsTrigger = (
  pncUpdateDataset: PncUpdateDataset,
  triggerCode: TriggerCode
): boolean | undefined => {
  // cjs code is a string that represents a court code, it combines top, second,third and bottom level codes
  // compare the OU code from the pncUpdateDataset with cjs code to get the thirdLevelPsaCode to get the court code
  const courtCode: string | null =
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation?.OrganisationUnitCode

  return true
}

export default mostSpecificCourtRuleAllowsTrigger
