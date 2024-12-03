import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import isEqual from "lodash.isequal"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import Phase from "../../types/Phase"
import type { Trigger } from "../../types/Trigger"
import type { TriggerGenerator } from "../../types/TriggerGenerator"
import errorPaths from "../exceptions/errorPaths"

const triggerCode = TriggerCode.TRPS0003
const phases: (Phase | undefined)[] = [Phase.PNC_UPDATE, Phase.PHASE_3]

const hasException200200 = (hearingOutcome: AnnotatedHearingOutcome, offenceIndex: number, resultIndex: number) => {
  const errorPath = errorPaths.offence(offenceIndex).result(resultIndex).resultVariableText
  return hearingOutcome.Exceptions.some(({ code, path }) => code === ExceptionCode.HO200200 && isEqual(path, errorPath))
}

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (!phases.includes(options?.phase)) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  return offences.reduce((triggers: Trigger[], offence, offenceIndex) => {
    const shouldGenerateTrigger = offence.Result.some((_, resultIndex) =>
      hasException200200(hearingOutcome, offenceIndex, resultIndex)
    )
    if (shouldGenerateTrigger) {
      triggers.push({ code: triggerCode, offenceSequenceNumber: offence?.CourtOffenceSequenceNumber })
    }

    return triggers
  }, [])
}

export default generator
