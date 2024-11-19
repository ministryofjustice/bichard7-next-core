import type { Trigger } from "../../types/Trigger"

export enum TriggerCreationType {
  CREATE,
  ADD,
  DELETE
}

const noteText = {
  [TriggerCreationType.ADD]: "Triggers added",
  [TriggerCreationType.CREATE]: "Trigger codes",
  [TriggerCreationType.DELETE]: "Triggers deleted"
}

const generateTriggersNoteText = (triggers: Trigger[], type = TriggerCreationType.CREATE): null | string => {
  if (triggers.length === 0) {
    return null
  }

  const counts = triggers.reduce((acc: Record<string, number>, e: Trigger) => {
    if (!acc[e.code]) {
      acc[e.code] = 0
    }

    acc[e.code] += 1
    return acc
  }, {})
  const segments = Object.keys(counts)
    .sort()
    .map((code) => `${counts[code]} x ${code}`)
  return `${noteText[type]}: ${segments.join(", ")}.`
}

export default generateTriggersNoteText
