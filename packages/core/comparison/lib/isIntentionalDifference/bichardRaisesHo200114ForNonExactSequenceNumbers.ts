import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

// When sequence numbers don't match exactly e.g. "2" and "002", and there are disposals with a 2007 result code, the
// areAnyPNCResults2007 function in Bichard (UpdateMessageSequenceBuilderImpl.java:518) incorrectly evaluates to false.
// As a result, Bichard raises a HO200114 exception, which Core avoids by casting the offence reason sequence to a
// number before checking its equivalence to an offence sequence number (which is a number, unlike in Bichard).

const bichardRaisesHo200114ForNonExactSequenceNumbers = ({
  expected,
  actual,
  incomingMessage,
  phase
}: ComparisonData) =>
  checkIntentionalDifferenceForPhases([2], phase, (): boolean => {
    const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    const bichardRaisesHo200114 =
      "exceptions" in expectedMatchingSummary &&
      expectedMatchingSummary.exceptions.some((exception) => exception.code === ExceptionCode.HO200114)

    const coreRaisesExceptions = "exceptions" in actualMatchingSummary

    const offenceNumbersAreZeroPadded =
      incomingMessage.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.every(
        (offence) =>
          !!offence.CriminalProsecutionReference?.OffenceReasonSequence &&
          /[0-9]{3}/.test(offence.CriminalProsecutionReference.OffenceReasonSequence)
      )

    return bichardRaisesHo200114 && !coreRaisesExceptions && !offenceNumbersAreZeroPadded
  })

export default bichardRaisesHo200114ForNonExactSequenceNumbers
