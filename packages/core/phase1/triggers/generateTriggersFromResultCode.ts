import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import isCaseRecordable from "../lib/isCaseRecordable"
import type { Trigger } from "../types/Trigger"
import type TriggerConfig from "../types/TriggerConfig"
import TriggerRecordable from "../types/TriggerRecordable"

export default (
  hearingOutcome: AnnotatedHearingOutcome,
  { triggerCode, resultCodesForTrigger, triggerRecordable, caseLevelTrigger }: TriggerConfig
): Trigger[] => {
  if (!resultCodesForTrigger) {
    throw new Error("resultCodesForTrigger is undefined")
  }

  const recordable = isCaseRecordable(hearingOutcome)

  if (
    (!recordable && triggerRecordable === TriggerRecordable.Yes) ||
    (recordable && triggerRecordable === TriggerRecordable.No)
  ) {
    return []
  }

  const shouldTrigger = (offence: Offence): boolean =>
    offence.Result.some((result) => result.CJSresultCode && resultCodesForTrigger.includes(result.CJSresultCode))

  const generateTriggers = (acc: Trigger[], offence: Offence): Trigger[] => {
    if (shouldTrigger(offence)) {
      acc.push({
        code: triggerCode,
        offenceSequenceNumber: offence.CourtOffenceSequenceNumber
      })
    }

    return acc
  }

  const triggers = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
    generateTriggers,
    []
  )
  if (caseLevelTrigger) {
    return triggers.length > 0 ? [{ code: triggerCode }] : []
  }

  return triggers
}
