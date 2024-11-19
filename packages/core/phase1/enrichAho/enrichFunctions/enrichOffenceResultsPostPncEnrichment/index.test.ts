jest.mock("./populateCourt")
jest.mock("./populateResultClass")
jest.mock("./populatePncDisposal")
jest.mock("../../../../lib/isCaseRecordable")

import isCaseRecordable from "../../../../lib/isCaseRecordable"
import type { AnnotatedHearingOutcome, Offence } from "../../../../types/AnnotatedHearingOutcome"
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
          CJSresultCode: 1115,
          ResultApplicableQualifierCode: ["A", "B"],
          Duration: [
            {
              DurationLength: 1,
              DurationType: "Duration type should not change",
              DurationUnit: "Duration unit should not change"
            },
            {
              DurationLength: 2,
              DurationType: "Should change",
              DurationUnit: "Duration unit should not change"
            },
            {
              DurationLength: 3,
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
    expect(Duration?.[0].DurationLength).toBe(1)
    expect(Duration?.[0].DurationType).toBe("Duration type should not change")
    expect(Duration?.[0].DurationUnit).toBe("Duration unit should not change")
    expect(Duration?.[1].DurationLength).toBe(2)
    expect(Duration?.[1].DurationType).toBe("Suspended")
    expect(Duration?.[1].DurationUnit).toBe("Duration unit should not change")
    expect(Duration?.[2].DurationLength).toBe(3)
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
