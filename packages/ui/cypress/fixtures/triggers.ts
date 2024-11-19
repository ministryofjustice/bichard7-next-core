import type TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { TestTrigger } from "../../test/utils/manageTriggers"

export const caseURL = "/bichard/court-cases/0"

export const unresolvedTriggers: TestTrigger[] = Array.from(Array(5)).map((_, idx) => {
  return {
    createdAt: new Date("2022-07-09T10:22:34.000Z"),
    status: "Unresolved",
    triggerCode: `TRPR000${idx + 1}` as TriggerCode,
    triggerId: idx
  }
})

export const unresolvedTrigger = unresolvedTriggers[0]

export const resolvedTriggers: TestTrigger[] = Array.from(Array(5)).map((_, idx) => {
  const triggerId = unresolvedTriggers.length + idx
  return {
    createdAt: new Date("2022-07-09T10:22:34.000Z"),
    status: "Resolved",
    triggerCode: `TRPR000${idx + 1}` as TriggerCode,
    triggerId
  }
})

export const resolvedTrigger = resolvedTriggers[0]

export const mixedTriggers = [...resolvedTriggers, ...unresolvedTriggers]

export const defaultTriggerCases = [
  {
    errorLockedByUsername: null,
    orgForPoliceFilter: "01",
    triggerLockedByUsername: null
  }
]
