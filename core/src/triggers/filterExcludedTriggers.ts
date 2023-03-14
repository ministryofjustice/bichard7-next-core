import excludedTriggerConfig from "../lib/excludedTriggerConfig"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { Trigger } from "../types/Trigger"
import type { TriggerCode } from "../types/TriggerCode"

const filterExcludedTriggers = (annotatedHearingOutcome: AnnotatedHearingOutcome, triggers: Trigger[]): Trigger[] => {
  const court =
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode
  const force = annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
  if (!force) {
    throw Error("Force not found")
  }

  const matchingCourtKeys = Object.keys(excludedTriggerConfig).filter((key) => court.startsWith(key))
  const courtHasRules = matchingCourtKeys.length > 0
  const forceHasRules = !!excludedTriggerConfig[force]

  const forceExcludesTrigger = (code: TriggerCode) => forceHasRules && excludedTriggerConfig[force].includes(code)

  const courtExcludesTrigger = (code: TriggerCode) =>
    matchingCourtKeys.some((key) => excludedTriggerConfig[key].includes(code))

  const shouldIncludeTrigger = (code: TriggerCode) => {
    const forceExcluded = forceExcludesTrigger(code)
    const courtExcluded = courtExcludesTrigger(code)
    if (!forceHasRules && !courtHasRules) {
      return true
    } else if (!courtHasRules) {
      return !forceExcluded
    } else if (!forceHasRules) {
      return !courtExcluded
    } else {
      return !forceExcluded || !courtExcluded
    }
  }

  return triggers.filter(({ code }) => shouldIncludeTrigger(code))
}

export default filterExcludedTriggers
