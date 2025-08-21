import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const getPncCheckname = (aho: AnnotatedHearingOutcome) =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCCheckname?.split("/")[0].substring(0, 12) ?? null

export default getPncCheckname
