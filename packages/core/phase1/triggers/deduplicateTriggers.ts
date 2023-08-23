import type { Trigger } from "phase1/types/Trigger"

type TriggerObject = {
  [k: string]: Trigger
}

const deduplicateTriggers = (triggers: Trigger[]): Trigger[] =>
  Object.values(
    triggers.reduce((acc: TriggerObject, trigger) => {
      const key = `${trigger.code}-${trigger.offenceSequenceNumber}`
      acc[key] = trigger
      return acc
    }, {})
  )

export default deduplicateTriggers
