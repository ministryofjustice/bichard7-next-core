import type { Offence } from "src/types/AnnotatedHearingOutcome"

const addNullOffenceReasonSequence = (hoOffence: Offence): void => {
  if (hoOffence.CriminalProsecutionReference.OffenceReasonSequence === undefined) {
    hoOffence.CriminalProsecutionReference.OffenceReasonSequence = null
  }
}

export default addNullOffenceReasonSequence
