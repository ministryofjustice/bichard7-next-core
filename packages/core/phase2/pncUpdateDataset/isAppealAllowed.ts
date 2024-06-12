import type { Offence } from "../../types/AnnotatedHearingOutcome"

const isAppealAllowed = (offence: Offence): boolean => {
  console.log("To be implemented: TriggerBuilder.java:1046-1053", !!offence)
  return false
}

export default isAppealAllowed
