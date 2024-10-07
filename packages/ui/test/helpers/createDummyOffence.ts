import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import createDummyResult from "./createDummyResult"
import cloneDeep from "lodash.clonedeep"

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
