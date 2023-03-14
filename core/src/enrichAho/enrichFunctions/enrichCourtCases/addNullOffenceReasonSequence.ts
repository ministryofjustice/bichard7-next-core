import type { Offence } from "../../../types/AnnotatedHearingOutcome"

const addNullOffenceReasonSequence = (hoOffence: Offence, force = false): void => {
  if (hoOffence.CriminalProsecutionReference.OffenceReasonSequence === undefined || force) {
    hoOffence.CriminalProsecutionReference.OffenceReasonSequence = null
  }
}

export default addNullOffenceReasonSequence
