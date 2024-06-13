import type { Offence } from "../../types/AnnotatedHearingOutcome"

const isAppealAllowed = (_offence: Offence): boolean => {
  // Assume this is always false as we don't currently handle appeals
  // @TODO clean up once this is confirmed through comparison tests 
  // B7 ref: TriggerBuilder.java:1046-1053
  return false
}

export default isAppealAllowed
