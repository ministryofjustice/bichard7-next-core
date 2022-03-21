import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type { Trigger } from "src/types/Trigger"
import type { TriggerCode } from "src/types/TriggerCode"
import config from "../../data/excluded-trigger-config.json"

interface ExcludedTriggerConfig {
  [key: string]: TriggerCode[]
}

const filterExcludedTriggers = (annotatedHearingOutcome: AnnotatedHearingOutcome, triggers: Trigger[]): Trigger[] => {
  const court =
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode
  const force = annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
  if (!force) {
    throw Error("Force not found")
  }

  const excludedTriggerConfig = config as ExcludedTriggerConfig
  const matchingCourtKeys = Object.keys(excludedTriggerConfig).filter((key) => court.startsWith(key))

  const forceExcludesTrigger = (code: TriggerCode) =>
    excludedTriggerConfig[force] && excludedTriggerConfig[force].includes(code)

  const courtExcludesTrigger = (code: TriggerCode) =>
    matchingCourtKeys.every((key) => excludedTriggerConfig[key].includes(code))

  return triggers.filter((trigger) => !(forceExcludesTrigger(trigger.code) && courtExcludesTrigger(trigger.code)))
}

export default filterExcludedTriggers
