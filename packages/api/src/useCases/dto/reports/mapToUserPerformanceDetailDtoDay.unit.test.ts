import type { UserDetailJsonRow } from "../../../types/reports/UserDetail"

import { mapToUserPerformanceDetailDtoDay } from "./mapToUserPerformanceDetailDtoDay"

jest.mock("../../data/exceptionDefinitions.json", () => ({
  def1: { code: "EXC", description: "Exception description" },
  def3: { code: "EXC_EMPTY" }
}))

jest.mock("@moj-bichard7-developers/bichard7-next-data/dist/data/trigger-definitions.json", () => ({
  def1: { code: "TRG_SHORT", description: "Long description", shortDescription: "Trigger short description" },
  def2: { code: "TRG_LONG", description: "Trigger long description only" },
  def3: { code: "TRG_EMPTY" }
}))

describe("mapToUserPerformanceDetailDtoDay", () => {
  const mockDate = new Date("2026-05-06T12:00:00Z")

  it("should return empty arrays when row is undefined", () => {
    const result = mapToUserPerformanceDetailDtoDay(mockDate)

    expect(result).toEqual({
      codeDetails: [],
      date: mockDate,
      totals: { resolved: 0, totalLocked: 0 }
    })
  })

  it("should map exceptions and triggers prioritizing shortDescription over description", () => {
    const mockRow = {
      exceptions: [{ code: "EXC", extraData: "foo", totals: { resolved: 1, totalLocked: 2 } }],
      triggers: [{ code: "TRG_SHORT", extraData: "bar", totals: { resolved: 3, totalLocked: 4 } }]
    } as unknown as UserDetailJsonRow

    const result = mapToUserPerformanceDetailDtoDay(mockDate, mockRow)

    expect(result).toEqual({
      codeDetails: [
        {
          code: "EXC",
          description: "Exception description",
          extraData: "foo",
          totals: { resolved: 1, totalLocked: 2 },
          type: "exception"
        },
        {
          code: "TRG_SHORT",
          description: "Trigger short description",
          extraData: "bar",
          totals: { resolved: 3, totalLocked: 4 },
          type: "trigger"
        }
      ],
      date: mockDate,
      totals: { resolved: 4, totalLocked: 6 }
    })
  })

  it("should fall back to 'description' when 'shortDescription' is missing", () => {
    const mockRow = {
      exceptions: [{ code: "EXC", totals: { resolved: 0, totalLocked: 0 } }],
      triggers: [{ code: "TRG_LONG", totals: { resolved: 0, totalLocked: 0 } }]
    } as unknown as UserDetailJsonRow

    const result = mapToUserPerformanceDetailDtoDay(mockDate, mockRow)

    expect(result).toEqual({
      codeDetails: [
        {
          code: "EXC",
          description: "Exception description",
          totals: { resolved: 0, totalLocked: 0 },
          type: "exception"
        },
        {
          code: "TRG_LONG",
          description: "Trigger long description only",
          totals: { resolved: 0, totalLocked: 0 },
          type: "trigger"
        }
      ],
      date: mockDate,
      totals: { resolved: 0, totalLocked: 0 }
    })
  })

  it("should fall back to 'Description unavailable' if definitions lack descriptions", () => {
    const mockRow = {
      exceptions: [{ code: "EXC_EMPTY", totals: { resolved: 0, totalLocked: 0 } }],
      triggers: [{ code: "TRG_EMPTY", totals: { resolved: 0, totalLocked: 0 } }]
    } as unknown as UserDetailJsonRow

    const result = mapToUserPerformanceDetailDtoDay(mockDate, mockRow)

    expect(result).toEqual({
      codeDetails: [
        {
          code: "EXC_EMPTY",
          description: "Description unavailable",
          totals: { resolved: 0, totalLocked: 0 },
          type: "exception"
        },
        {
          code: "TRG_EMPTY",
          description: "Description unavailable",
          totals: { resolved: 0, totalLocked: 0 },
          type: "trigger"
        }
      ],
      date: mockDate,
      totals: { resolved: 0, totalLocked: 0 }
    })
  })

  it("should fall back to 'Unknown' if the code is entirely missing from the JSON", () => {
    const mockRow = {
      exceptions: [{ code: "MISSING_EXC", totals: { resolved: 0, totalLocked: 0 } }],
      triggers: [{ code: "MISSING_TRG", totals: { resolved: 0, totalLocked: 0 } }]
    } as unknown as UserDetailJsonRow

    const result = mapToUserPerformanceDetailDtoDay(mockDate, mockRow)

    expect(result).toEqual({
      codeDetails: [
        {
          code: "MISSING_EXC",
          description: "Unknown Exception (MISSING_EXC)",
          totals: { resolved: 0, totalLocked: 0 },
          type: "exception"
        },
        {
          code: "MISSING_TRG",
          description: "Unknown Trigger (MISSING_TRG)",
          totals: { resolved: 0, totalLocked: 0 },
          type: "trigger"
        }
      ],
      date: mockDate,
      totals: { resolved: 0, totalLocked: 0 }
    })
  })
})
