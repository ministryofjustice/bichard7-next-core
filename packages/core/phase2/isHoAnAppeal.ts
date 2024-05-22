import type { HearingOutcome } from "../types/AnnotatedHearingOutcome"

const isHoAnAppeal = (_ho: HearingOutcome) => {
  // TODO: we don't currently handle appeals so this function should always return false.
  // TODO: Remove once we're happy with the implementation
  // From old Bichard:
  // The HO is an appeal if it contains any offence
  // which (a) has the AppealResult element set, or (b) contains any result where the ResultClass
  // element has the value "Appeal Outcome" - Only happens in XHIBIT results
  return false
}

export default isHoAnAppeal
