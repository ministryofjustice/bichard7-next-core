import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { findNextHearing } from "../utils/findNextHearing"
import { aggregateOutcome } from "./aggregateOutcome"
import { analyzeResult } from "./analyzeResult"

jest.mock("./analyzeResult")
jest.mock("../utils/findNextHearing")

describe("aggregateOutcome", () => {
  const mockResult = (id: string) => ({ ResultClass: id }) as unknown as Result

  beforeEach(() => {
    jest.resetAllMocks()
    ;(analyzeResult as jest.Mock).mockReturnValue({
      bail: false,
      firstInstance: false,
      noBail: false,
      parentResult: false,
      witnessResult: false
    })
    ;(findNextHearing as jest.Mock).mockReturnValue(undefined)
  })

  it("should initialize with default empty state when no results are provided", () => {
    const outcome = aggregateOutcome([])

    expect(outcome).toEqual({
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
  })

  it("should set flags to true if any result contains them", () => {
    const results = [mockResult("1"), mockResult("2")]

    ;(analyzeResult as jest.Mock)
      .mockReturnValueOnce({ bail: true, parentResult: false })
      .mockReturnValueOnce({ bail: false, parentResult: true })

    const outcome = aggregateOutcome(results)

    expect(outcome.flags.bail).toBe(true)
    expect(outcome.flags.parentResult).toBe(true)
    expect(outcome.flags.witnessResult).toBe(false)
  })

  it("should capture the first warrant and withdrawn text found and ignore subsequent ones", () => {
    const results = [mockResult("1"), mockResult("2")]

    ;(analyzeResult as jest.Mock)
      .mockReturnValueOnce({ warrantResultText: "First Warrant", withdrawnResultText: "First Withdrawn" })
      .mockReturnValueOnce({ warrantResultText: "Second Warrant", withdrawnResultText: "Second Withdrawn" })

    const outcome = aggregateOutcome(results)

    expect(outcome.warrantResultText).toBe("First Warrant")
    expect(outcome.withdrawnResultText).toBe("First Withdrawn")
  })

  it("should collect unique next hearings and filter out duplicates by uniqueKey", () => {
    const results = [mockResult("1"), mockResult("2"), mockResult("3")]

    const hearingA = { date: "2023-01-01", uniqueKey: "A" }
    const hearingB = { date: "2023-01-02", uniqueKey: "B" }
    const duplicateA = { date: "2023-01-01", uniqueKey: "A" }

    ;(findNextHearing as jest.Mock)
      .mockReturnValueOnce(hearingA)
      .mockReturnValueOnce(hearingB)
      .mockReturnValueOnce(duplicateA)

    const outcome = aggregateOutcome(results)

    expect(outcome.nextHearings).toHaveLength(2)
    expect(outcome.nextHearings).toEqual([hearingA, hearingB])
  })

  it("should handle results where no next hearing is found", () => {
    const results = [mockResult("1")]
    ;(findNextHearing as jest.Mock).mockReturnValue(null)

    const outcome = aggregateOutcome(results)

    expect(outcome.nextHearings).toEqual([])
  })
})
