import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import cloneDeep from "lodash.clonedeep"
import createDummyResult from "./createDummyResult"

const createDummyOffence = (): Offence =>
  ({
    CriminalProsecutionReference: {
      DefendantOrOffender: {
        DefendantOrOffenderSequenceNumber: "0000"
      },
      OffenceReasonSequence: "0000"
    },
    ActualOffenceStartDate: {
      StartDate: new Date("1990-01-01")
    },
    OffenceTitle: "Crime",

    Result: [cloneDeep(createDummyResult()), cloneDeep(createDummyResult())]
  }) as Offence

export default createDummyOffence
