import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { TriggerGenerator } from "../../types/TriggerGenerator"

import isCaseRecordable from "../isCaseRecordable"
import getOffenceFullCode from "../offences/getOffenceFullCode"

const triggerCode = TriggerCode.TRPR0030
const offenceCodes = ["PL84504", "PL84505", "PL84506"]

const isMatchingOffence = (offence: Offence) => {
  const fullCode = getOffenceFullCode(offence)
  return fullCode && offenceCodes.includes(fullCode)
}

const generator: TriggerGenerator = (hearingOutcome: AnnotatedHearingOutcome) => {
  const recordable = isCaseRecordable(hearingOutcome)
  if (
    !recordable &&
    hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(isMatchingOffence)
  ) {
    return [{ code: triggerCode }]
  }

  return []
}

export default generator
