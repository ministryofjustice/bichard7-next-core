jest.mock("src/use-cases/enrichHearingOutcome/enrichFunctions/enrichOffenceResultsPostPncEnrichment/populateCourt")
jest.mock(
  "src/use-cases/enrichHearingOutcome/enrichFunctions/enrichOffenceResultsPostPncEnrichment/populateResultClass"
)
jest.mock(
  "src/use-cases/enrichHearingOutcome/enrichFunctions/enrichOffenceResultsPostPncEnrichment/populatePncDisposal"
)
jest.mock("src/lib/isCaseRecordable")

import isCaseRecordable from "src/lib/isCaseRecordable"
import { SUSPENDED, SUSPENDED_2ND_DURATION_RESULTS } from "src/lib/properties"
import type { AnnotatedHearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import enrichOffenceResultsPostPncEnrichment from "./index"
import populateCourt from "./populateCourt"
import populatePncDisposal from "./populatePncDisposal"
import populateResultClass from "./populateResultClass"

describe("enrichOffenceResultsPostPncEnrichment", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should set Result Hearing Date to Conviction Date", () => {
    const convictionDate = new Date("2022-04-01T10:15:00.000Z")
    const offence = {
      ConvictionDate: convictionDate,
      Result: [
        {
          ResultApplicableQualifierCode: ["A", "B"]
        }
      ]
    } as Offence

    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            DateOfHearing: new Date()
          },
          Case: {
            HearingDefendant: {
              Offence: [offence]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    enrichOffenceResultsPostPncEnrichment(hearingOutcome)

    const { ResultHearingDate, ResultApplicableQualifierCode, Duration } = offence.Result[0]
    expect(ResultHearingDate).toBe(convictionDate)
    expect(ResultApplicableQualifierCode).toHaveLength(0)
    expect(populateCourt).toHaveBeenCalledTimes(1)
    expect(isCaseRecordable).toHaveBeenCalledTimes(1)
    expect(populateResultClass).not.toHaveBeenCalled()
    expect(populatePncDisposal).not.toHaveBeenCalled()
    expect(Duration).toBeUndefined()
  })

  it("should set Result Hearing Date to Date of Hearing", () => {
    const dateOfHearing = new Date("2022-05-01T10:15:00.000Z")
    const offence = {
      ConvictionDate: undefined,
      Result: [
        {
          ResultApplicableQualifierCode: ["A", "B"]
        }
      ]
    } as Offence

    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            DateOfHearing: dateOfHearing
          },
          Case: {
            HearingDefendant: {
              Offence: [offence]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    enrichOffenceResultsPostPncEnrichment(hearingOutcome)

    const { ResultHearingDate, ResultApplicableQualifierCode, Duration } = offence.Result[0]
    expect(ResultHearingDate).toBe(dateOfHearing)
    expect(ResultApplicableQualifierCode).toHaveLength(0)
    expect(populateCourt).toHaveBeenCalledTimes(1)
    expect(isCaseRecordable).toHaveBeenCalledTimes(1)
    expect(populateResultClass).not.toHaveBeenCalled()
    expect(populatePncDisposal).not.toHaveBeenCalled()
    expect(Duration).toBeUndefined()
  })

  it("should set the 2nd Duration Type to Suspended when there CJS result code is for 2nd suspended duration and there is at least 2 Durations", () => {
    const convictionDate = new Date("2022-04-01T10:15:00.000Z")
    const offence = {
      ConvictionDate: convictionDate,
      Result: [
        {
          CJSresultCode: SUSPENDED_2ND_DURATION_RESULTS[0],
          ResultApplicableQualifierCode: ["A", "B"],
          Duration: [
            {
              DurationLength: "Duration length should not change",
              DurationType: "Duration type should not change",
              DurationUnit: "Duration unit should not change"
            },
            {
              DurationLength: "Duration length should not change",
              DurationType: "Should change",
              DurationUnit: "Duration unit should not change"
            },
            {
              DurationLength: "Duration length should not change",
              DurationType: "Duration type should not change",
              DurationUnit: "Duration unit should not change"
            }
          ]
        }
      ]
    } as Offence

    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            DateOfHearing: new Date()
          },
          Case: {
            HearingDefendant: {
              Offence: [offence]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    enrichOffenceResultsPostPncEnrichment(hearingOutcome)

    const { ResultHearingDate, ResultApplicableQualifierCode, Duration } = offence.Result[0]
    expect(ResultHearingDate).toBe(convictionDate)
    expect(ResultApplicableQualifierCode).toHaveLength(0)
    expect(populateCourt).toHaveBeenCalledTimes(1)
    expect(isCaseRecordable).toHaveBeenCalledTimes(1)
    expect(populateResultClass).not.toHaveBeenCalled()
    expect(populatePncDisposal).not.toHaveBeenCalled()
    expect(Duration?.[0].DurationLength).toBe("Duration length should not change")
    expect(Duration?.[0].DurationType).toBe("Duration type should not change")
    expect(Duration?.[0].DurationUnit).toBe("Duration unit should not change")
    expect(Duration?.[1].DurationLength).toBe("Duration length should not change")
    expect(Duration?.[1].DurationType).toBe(SUSPENDED)
    expect(Duration?.[1].DurationUnit).toBe("Duration unit should not change")
    expect(Duration?.[2].DurationLength).toBe("Duration length should not change")
    expect(Duration?.[2].DurationType).toBe("Duration type should not change")
    expect(Duration?.[2].DurationUnit).toBe("Duration unit should not change")
  })

  it("should populate result class and PNC disposal when case is recordable", () => {
    const mockedIsCaseRecordable = isCaseRecordable as jest.MockedFunction<typeof isCaseRecordable>
    mockedIsCaseRecordable.mockReturnValue(true)

    const convictionDate = new Date("2022-04-01T10:15:00.000Z")
    const offence = {
      ConvictionDate: convictionDate,
      Result: [
        {
          ResultApplicableQualifierCode: ["A", "B"]
        }
      ]
    } as Offence

    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            DateOfHearing: new Date()
          },
          Case: {
            HearingDefendant: {
              Offence: [offence]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    enrichOffenceResultsPostPncEnrichment(hearingOutcome)

    const { ResultHearingDate, ResultApplicableQualifierCode, Duration } = offence.Result[0]
    expect(ResultHearingDate).toBe(convictionDate)
    expect(ResultApplicableQualifierCode).toHaveLength(0)
    expect(populateCourt).toHaveBeenCalledTimes(1)
    expect(isCaseRecordable).toHaveBeenCalledTimes(1)
    expect(populateResultClass).toHaveBeenCalledTimes(1)
    expect(populatePncDisposal).toHaveBeenCalledTimes(1)
    expect(Duration).toBeUndefined()
  })
})
