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
      date: mockDate
    })
  })

  it("should map exceptions and triggers prioritizing shortDescription over description", () => {
    const mockRow = {
      exceptions: [{ code: "EXC", extraData: "foo" }],
      triggers: [{ code: "TRG_SHORT", extraData: "bar" }]
    } as unknown as UserDetailJsonRow

    const result = mapToUserPerformanceDetailDtoDay(mockDate, mockRow)

    expect(result).toEqual({
      codeDetails: [
        { code: "EXC", description: "Exception description", extraData: "foo", type: "exception" },
        { code: "TRG_SHORT", description: "Trigger short description", extraData: "bar", type: "trigger" }
      ],
      date: mockDate
    })
  })

  it("should fall back to 'description' when 'shortDescription' is missing", () => {
    const mockRow = {
      exceptions: [{ code: "EXC" }],
      triggers: [{ code: "TRG_LONG" }]
    } as unknown as UserDetailJsonRow

    const result = mapToUserPerformanceDetailDtoDay(mockDate, mockRow)

    expect(result).toEqual({
      codeDetails: [
        { code: "EXC", description: "Exception description", type: "exception" },
        { code: "TRG_LONG", description: "Trigger long description only", type: "trigger" }
      ],
      date: mockDate
    })
  })

  it("should fall back to 'Unknown Exception' or 'Unknown Trigger' if definitions lack descriptions", () => {
    const mockRow = {
      exceptions: [{ code: "EXC_EMPTY" }],
      triggers: [{ code: "TRG_EMPTY" }]
    } as unknown as UserDetailJsonRow

    const result = mapToUserPerformanceDetailDtoDay(mockDate, mockRow)

    expect(result).toEqual({
      codeDetails: [
        { code: "EXC_EMPTY", description: "Unknown Exception", type: "exception" },
        { code: "TRG_EMPTY", description: "Unknown Trigger", type: "trigger" }
      ],
      date: mockDate
    })
  })

  it("should fall back to 'Description unavailable' if the code is entirely missing from the JSON", () => {
    const mockRow = {
      exceptions: [{ code: "MISSING_EXC" }],
      triggers: [{ code: "MISSING_TRG" }]
    } as unknown as UserDetailJsonRow

    const result = mapToUserPerformanceDetailDtoDay(mockDate, mockRow)

    expect(result).toEqual({
      codeDetails: [
        { code: "MISSING_EXC", description: "Description unavailable", type: "exception" },
        { code: "MISSING_TRG", description: "Description unavailable", type: "trigger" }
      ],
      date: mockDate
    })
  })
})
