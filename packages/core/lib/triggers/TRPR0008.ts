import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { CjsPlea } from "@moj-bichard7/common/types/Plea"

import type { TriggerGenerator } from "../../types/TriggerGenerator"

import { CjsVerdict } from "../../types/Verdict"
import getOffenceFullCode from "../offences/getOffenceFullCode"

const triggerCode = TriggerCode.TRPR0008
const offenceCodes = ["BA76004", "BA76005"]

const isMatchingOffence = (offence: Offence) => {
  const fullCode = getOffenceFullCode(offence)
  return (
    fullCode &&
    offenceCodes.includes(fullCode) &&
    offence.Result.some((result) => result.Verdict === CjsVerdict.Guilty || result.PleaStatus === CjsPlea.Admits)
  )
}

const generator: TriggerGenerator = (hearingOutcome) => {
  if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(isMatchingOffence)) {
    return [{ code: triggerCode }]
  }

  return []
}

export default generator
