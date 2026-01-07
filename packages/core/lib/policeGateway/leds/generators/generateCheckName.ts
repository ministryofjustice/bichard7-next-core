import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const generateCheckName = (aho: AnnotatedHearingOutcome): string =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.FamilyName?.substring(
    0,
    54
  ).trim() ?? ""

export default generateCheckName
