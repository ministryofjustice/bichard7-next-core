import type { Trigger } from "../../../types/Trigger"

const generateTriggersLogAttributes = (triggers: Trigger[], hasExceptions: boolean): Record<string, unknown> => ({
  "Number of Triggers": triggers.length,
  "Trigger and Exception Flag": hasExceptions,
  ...triggers.reduce((acc: Record<string, unknown>, trigger, i) => {
    acc[`Trigger ${i + 1} Details`] = trigger.code

    return acc
  }, {})
})

export default generateTriggersLogAttributes
