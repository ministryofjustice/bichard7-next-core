import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { formatOffenceData } from "../../utils/formatOffenceData"
import { aggregateOutcome } from "./aggregateOutcome"
import { calculateBailStatus } from "./calculateBailStatus"
import { calculateWarrantType } from "./calculateWarrantType"
import { hearingOutcomeDetails } from "./hearingOutcomeDetails"

jest.mock("./aggregateOutcome")
jest.mock("./calculateBailStatus")
jest.mock("./calculateWarrantType")
jest.mock("../../utils/formatOffenceData")

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
              }
            ]
          }
        }
      }
    }
  } as unknown as AnnotatedHearingOutcome

  beforeEach(() => {
    jest.resetAllMocks()
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: {
        bail: false,
        noBail: false,
        parentResult: false,
        witnessResult: false
      },
      nextHearings: [],
      warrantResultText: undefined,
      withdrawnResultText: undefined
    })
    ;(formatOffenceData as jest.Mock).mockReturnValue({
      nextCourtDates: "2023-01-01\n2023-01-02",
      nextCourtNames: "Court\nNames",
      offenceTitles: "Mocked Titles.",
      offenceWordings: "Mocked Wordings"
    })
    ;(calculateWarrantType as jest.Mock).mockReturnValue("MockWarrantType")
    ;(calculateBailStatus as jest.Mock).mockReturnValue("MockBailStatus")
  })

  it("should use formatOffenceData for titles, wordings, and next court details", () => {
    const result = hearingOutcomeDetails(mockAho, false, false)

    expect(formatOffenceData).toHaveBeenCalledWith(mockAho)

    expect(result.offenceTitles).toBe("Mocked Titles.")
    expect(result.offenceWordings).toBe("Mocked Wordings")
    expect(result.nextCourtName).toBe("Court Names")
    expect(result.nextCourtDate).toBe("2023-01-01 2023-01-02")
  })

  it("should aggregate results from all offences in the AHO", () => {
    const multiOffenceAho = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [{ Result: [{ id: 1 }] }, { Result: [{ id: 2 }] }]
            }
          }
        }
      }
    } as any

    hearingOutcomeDetails(multiOffenceAho, false, false)

    expect(aggregateOutcome).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }])
  })

  it("should pass calculated flags to calculateWarrantType", () => {
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: { parentResult: true, witnessResult: true },
      nextHearings: []
    })

    hearingOutcomeDetails(mockAho, true, false) // tRPR0012Present=true

    expect(calculateWarrantType).toHaveBeenCalledWith(
      expect.objectContaining({
        parentResult: true,
        tRPR0002Present: false,
        tRPR0012Present: true,
        witnessResult: true
      })
    )
  })

  it("should determine hasNextCourtAppearance based on aggregateOutcome hearings", () => {
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: { bail: true, noBail: false },
      nextHearings: [{ date: "2023-05-01" }]
    })

    hearingOutcomeDetails(mockAho, false, false)

    expect(calculateBailStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        bail: true,
        hasNextCourtAppearance: true
      })
    )
  })

  it("should join withdrawn and warrant text into a single block", () => {
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: {},
      nextHearings: [],
      warrantResultText: "Warrant Info",
      withdrawnResultText: "Withdrawn Info"
    })

    const result = hearingOutcomeDetails(mockAho, false, false)

    expect(result.warrantText).toBe("Withdrawn Info\nWarrant Info")
  })

  it("should handle missing warrant or withdrawn text", () => {
    ;(aggregateOutcome as jest.Mock).mockReturnValue({
      flags: {},
      nextHearings: [],
      warrantResultText: "Only Warrant",
      withdrawnResultText: undefined
    })

    const result = hearingOutcomeDetails(mockAho, false, false)

    expect(result.warrantText).toBe("Only Warrant")
  })
})
