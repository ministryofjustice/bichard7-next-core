import type { AnnotatedHearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import type { Trigger } from "src/types/Trigger"
import type TriggerConfig from "src/types/TriggerConfig"
import TriggerRecordable from "src/types/TriggerRecordable"

export default (
  hearingOutcome: AnnotatedHearingOutcome,
  { triggerCode, resultCodesForTrigger, triggerRecordable, caseLevelTrigger }: TriggerConfig,
  recordable: boolean
): Trigger[] => {
  if (!resultCodesForTrigger) {
    throw new Error("resultCodesForTrigger is undefined")
  }

  if (
    (!recordable && triggerRecordable === TriggerRecordable.Yes) ||
    (recordable && triggerRecordable === TriggerRecordable.No)
  ) {
    return []
  }

  const shouldTrigger = (offence: Offence): boolean =>
    offence.Result.some((result) => resultCodesForTrigger.includes(parseInt(result.CJSresultCode, 10)))

  const generateTriggers = (acc: Trigger[], offence: Offence): Trigger[] => {
    if (shouldTrigger(offence)) {
      acc.push({
        code: triggerCode,
        offenceSequenceNumber: parseInt(offence.CourtOffenceSequenceNumber, 10)
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
