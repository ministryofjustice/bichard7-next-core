import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { aggregateOutcome } from "./aggregateOutcome"
import { calculateBailStatus } from "./calculateBailStatus"
import { calculateWarrantType } from "./calculateWarrantType"
import { hearingOutcomeDetails } from "./hearingOutcomeDetails"

jest.mock("./aggregateOutcome")
jest.mock("./calculateBailStatus")
jest.mock("./calculateWarrantType")

describe("hearingOutcomeDetails", () => {
  const mockAho = {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: [
              {
                ActualOffenceWording: "Wording 1",
                OffenceTitle: "Offence 1",
                Result: [{ ResultClass: "Result1" }]
              },
              {
                ActualOffenceWording: undefined,
                OffenceTitle: "Offence 2",
                Result: [{ ResultClass: "Result2" }]
              }
            ]
          }
        }
      }
    }
  } as unknown as AnnotatedHearingOutcome

  beforeEach(() => {
    jest.resetAllMocks()

    // Default mock returns
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: {
        bail: false,
        firstInstance: false,
        noBail: false,
        parentResult: false,
        witnessResult: false
      },
      nextHearings: [],
      warrantResultText: undefined,
      withdrawnResultText: undefined
    })
    ;(calculateWarrantType as jest.Mock).mockReturnValue("MockWarrantType")
    ;(calculateBailStatus as jest.Mock).mockReturnValue("MockBailStatus")
  })

  it("should extract and join offence titles and wordings", () => {
    const result = hearingOutcomeDetails(mockAho, false, false)

    expect(result.offenceTitles).toBe("Offence 1\nOffence 2")
    expect(result.offenceWordings).toBe("Wording 1\nUnavailable")
  })

  it("should aggregate results from all offences", () => {
    hearingOutcomeDetails(mockAho, false, false)

    const expectedResults = [{ ResultClass: "Result1" }, { ResultClass: "Result2" }]

    // Verify aggregateOutcome was called with the flattened list of results
    expect(aggregateOutcome).toHaveBeenCalledWith(expectedResults)
  })

  it("should pass calculated flags to calculateWarrantType", () => {
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: {
        parentResult: true,
        witnessResult: true
      },
      nextHearings: []
    })

    hearingOutcomeDetails(mockAho, true, false) // tRPR0012Present=true

    expect(calculateWarrantType).toHaveBeenCalledWith({
      parentResult: true,
      tRPR0002Present: false,
      tRPR0012Present: true,
      witnessResult: true
    })
  })

  it("should pass bail flags and next hearing existence to calculateBailStatus", () => {
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: {
        bail: true,
        noBail: false
      },
      nextHearings: [{ date: "2023-01-01" }] // hasNextCourtAppearance should be true
    })

    hearingOutcomeDetails(mockAho, false, true) // tRPR0002Present=true

    expect(calculateBailStatus).toHaveBeenCalledWith({
      bail: true,
      hasNextCourtAppearance: true,
      noBail: false,
      tRPR0002Present: true,
      tRPR0012Present: false
    })
  })

  it("should combine withdrawn and warrant text into final warrantText", () => {
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: {},
      nextHearings: [],
      warrantResultText: "Warrant Text",
      withdrawnResultText: "Withdrawn Text"
    })

    const result = hearingOutcomeDetails(mockAho, false, false)

    expect(result.warrantText).toBe("Withdrawn Text\nWarrant Text")
  })

  it("should handle missing warrant text gracefully", () => {
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: {},
      nextHearings: [],
      warrantResultText: "Only Warrant Text",
      withdrawnResultText: undefined
    })

    const result = hearingOutcomeDetails(mockAho, false, false)

    expect(result.warrantText).toBe("Only Warrant Text")
  })

  it("should format next court dates and names from aggregated hearings", () => {
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: {},
      nextHearings: [
        { courtName: "Court A", date: "2023-05-01" },
        { courtName: "Court B", date: "2023-06-01" }
      ]
    })

    const result = hearingOutcomeDetails(mockAho, false, false)

    expect(result.nextCourtDate).toBe("2023-05-01 2023-06-01")
    expect(result.nextCourtName).toBe("Court A Court B")
  })

  it("should handle unavailable court details", () => {
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: {},
      nextHearings: [{ courtName: undefined, date: undefined }]
    })

    const result = hearingOutcomeDetails(mockAho, false, false)

    expect(result.nextCourtDate).toBe("Unavailable")
    expect(result.nextCourtName).toBe("Unavailable")
  })
})
