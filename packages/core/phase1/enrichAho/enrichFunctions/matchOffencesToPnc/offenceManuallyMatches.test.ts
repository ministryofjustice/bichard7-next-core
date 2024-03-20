import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOffenceWithCaseRef } from "./matchOffencesToPnc"
import { offenceManuallyMatches } from "./offenceManuallyMatches"

const mockHoOffence = (caseRef?: string, sequence?: number | string): Offence =>
  ({
    ManualSequenceNumber: sequence !== undefined,
    ManualCourtCaseReference: caseRef !== undefined,
    CriminalProsecutionReference: { OffenceReasonSequence: sequence ?? 1 },
    CourtCaseReferenceNumber: caseRef ?? "21/1234/001234A"
  }) as unknown as Offence

const mockPncOffence = (caseRef?: string, sequence?: number): PncOffenceWithCaseRef =>
  ({
    caseReference: caseRef ?? "21/1234/001234A",
    pncOffence: {
      offence: {
        sequenceNumber: sequence ?? 1
      }
    }
  }) as unknown as PncOffenceWithCaseRef

describe("offenceManuallyMatches", () => {
  it("should be true when the offence is manually matched with both case reference and sequence number", () => {
    const hoOffence = mockHoOffence("ABC123", 1)
    const pncOffence = mockPncOffence("ABC123", 1)

    const result = offenceManuallyMatches(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be true when the offence is manually matched with just case reference", () => {
    const hoOffence = mockHoOffence("ABC123")
    const pncOffence = mockPncOffence("ABC123", 1)

    const result = offenceManuallyMatches(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be true when the offence is manually matched with just sequence number", () => {
    const hoOffence = mockHoOffence(undefined, 3)
    const pncOffence = mockPncOffence(undefined, 3)

    const result = offenceManuallyMatches(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be false when the manual sequence number is invalid", () => {
    const hoOffence = mockHoOffence("ABC123", "x")
    const pncOffence = mockPncOffence("ABC123", 1)

    const result = offenceManuallyMatches(hoOffence, pncOffence)
    expect(result).toBe(false)
  })

  it("should be false when there is no manual matching", () => {
    const hoOffence = mockHoOffence()
    const pncOffence = mockPncOffence()

    const result = offenceManuallyMatches(hoOffence, pncOffence)
    expect(result).toBe(false)
  })
})
