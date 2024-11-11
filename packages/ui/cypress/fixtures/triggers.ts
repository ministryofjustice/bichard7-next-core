import type TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type { TestTrigger } from "../../test/utils/manageTriggers"

export const caseURL = "/bichard/court-cases/0"

export const unresolvedTriggers: TestTrigger[] = Array.from(Array(5)).map((_, idx) => {
  return {
    triggerId: idx,
    triggerCode: `TRPR000${idx + 1}` as TriggerCode,
    status: "Unresolved",
    createdAt: new Date("2022-07-09T10:22:34.000Z")
  }
})

export const unresolvedTrigger = unresolvedTriggers[0]

export const resolvedTriggers: TestTrigger[] = Array.from(Array(5)).map((_, idx) => {
  const triggerId = unresolvedTriggers.length + idx
  return {
    triggerId,
    triggerCode: `TRPR000${idx + 1}` as TriggerCode,
    status: "Resolved",
    createdAt: new Date("2022-07-09T10:22:34.000Z")
  }
})

export const resolvedTrigger = resolvedTriggers[0]

export const mixedTriggers = [...resolvedTriggers, ...unresolvedTriggers]

export const defaultTriggerCases = [
  {
    errorLockedByUsername: null,
    triggerLockedByUsername: null,
    orgForPoliceFilter: "01"
  }
]
