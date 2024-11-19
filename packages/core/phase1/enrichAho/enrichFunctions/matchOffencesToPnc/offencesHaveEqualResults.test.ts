import type { Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import offencesHaveEqualResults from "./offencesHaveEqualResults"

const createOffenceWithResults = (
  results: Pick<
    Result,
    "CJSresultCode" | "ResultHearingDate" | "PNCAdjudicationExists" | "ResultVariableText" | "NextHearingDate"
  >[]
): Offence =>
  ({
    Result: results.map((result) => ({
      ...result,
      ResultHearingDate: result.ResultHearingDate ?? new Date("2009-09-09"),
      PNCAdjudicationExists: !!result.PNCAdjudicationExists
    }))
  }) as Offence

it("should return false if there are different recordable result codes and adjudications", () => {
  const o1 = createOffenceWithResults([{ CJSresultCode: 7520 }])
  const o2 = createOffenceWithResults([{ CJSresultCode: 4520, PNCAdjudicationExists: true }])
  const result = offencesHaveEqualResults([o1, o2])
  expect(result).toBe(false)
})

it("should return false if results are different but adjudications are the same", () => {
  const o1 = createOffenceWithResults([{ CJSresultCode: 7520, ResultHearingDate: new Date("2009-09-09") }])
  const o2 = createOffenceWithResults([
    { CJSresultCode: 4520, ResultHearingDate: new Date("2009-09-10"), PNCAdjudicationExists: true }
  ])
  const result = offencesHaveEqualResults([o1, o2])
  expect(result).toBe(false)
})

it("should return false if all fields are different except the date", () => {
  const o1 = createOffenceWithResults([{ CJSresultCode: 4563, PNCAdjudicationExists: true }])
  const o2 = createOffenceWithResults([{ CJSresultCode: 4263 }])
  const result = offencesHaveEqualResults([o1, o2])
  expect(result).toBe(false)
})

it("should return false if all fields are different except the result code", () => {
  const o1 = createOffenceWithResults([{ CJSresultCode: 4520, ResultHearingDate: new Date("2019-09-09") }])
  const o2 = createOffenceWithResults([{ CJSresultCode: 4520, PNCAdjudicationExists: true }])
  const result = offencesHaveEqualResults([o1, o2])
  expect(result).toBe(false)
})

it("should return true if all fields are the same", () => {
  const o1 = createOffenceWithResults([{ CJSresultCode: 4563 }])
  const o2 = createOffenceWithResults([{ CJSresultCode: 4563 }])
  const result = offencesHaveEqualResults([o1, o2])
  expect(result).toBe(true)
})

it("should return true if all fields are the same except the adjudication", () => {
  const o1 = createOffenceWithResults([{ CJSresultCode: 4563, PNCAdjudicationExists: true }])
  const o2 = createOffenceWithResults([{ CJSresultCode: 4563, PNCAdjudicationExists: false }])
  const result = offencesHaveEqualResults([o1, o2])
  expect(result).toBe(true)
})

it("should return false if all fields are the same except the date", () => {
  const o1 = createOffenceWithResults([
    { CJSresultCode: 4563, ResultHearingDate: new Date("2009-09-09"), PNCAdjudicationExists: true }
  ])
  const o2 = createOffenceWithResults([
    { CJSresultCode: 4563, ResultHearingDate: new Date("2009-09-10"), PNCAdjudicationExists: true }
  ])
  const result = offencesHaveEqualResults([o1, o2])
  expect(result).toBe(false)
})

it("should return false if the result codes are different", () => {
  const o1 = createOffenceWithResults([{ CJSresultCode: 4563, PNCAdjudicationExists: true }])
  const o2 = createOffenceWithResults([{ CJSresultCode: 4520, PNCAdjudicationExists: true }])
  const result = offencesHaveEqualResults([o1, o2])
  expect(result).toBe(false)
})

it("should return true for an empty list()", () => {
  const result = offencesHaveEqualResults([])
  expect(result).toBe(true)
})

it("should return true for a single item in a list", () => {
  const input = [createOffenceWithResults([{ CJSresultCode: 4563 }])]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(true)
})

it("should return false if one item in a list is different", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4562, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(false)
})

it("should return true if all items are the same()", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(true)
})

it("should return false if there are different numbers of results", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4563 }]),
    createOffenceWithResults([{ CJSresultCode: 4563 }, { CJSresultCode: 4563 }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(false)
})

// Check that order of results is not significant - all results recordable
it("should not take the order of the results into account", () => {
  const input = [
    createOffenceWithResults([
      { CJSresultCode: 4562, ResultHearingDate: new Date("2010-10-10") },
      { CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }
    ]),
    createOffenceWithResults([
      { CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") },
      { CJSresultCode: 4562, ResultHearingDate: new Date("2010-10-10") }
    ])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(true)
})

// Check that non-recordable results are ignored during matching
it("should ignore non-recordable results", () => {
  const input = [
    createOffenceWithResults([
      { CJSresultCode: 4562, ResultHearingDate: new Date("2010-10-10") },
      { CJSresultCode: 3501, ResultHearingDate: new Date("2010-10-10") }
    ]),
    createOffenceWithResults([{ CJSresultCode: 4562, ResultHearingDate: new Date("2010-10-10") }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(true)
})

// Check that non-recordable results are ignored during matching (all results non-recordable)
it("should return true if all results are non-recordable", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 1000, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([
      { CJSresultCode: 3501, ResultHearingDate: new Date("2010-10-10") },
      { CJSresultCode: 3501, ResultHearingDate: new Date("2010-10-10") }
    ])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(true)
})

it("should return true if neither offences have results", () => {
  const input = [createOffenceWithResults([]), createOffenceWithResults([])]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(true)
})

it("should compare the result text if it has been amended", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4563, ResultVariableText: "**Test text" }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultVariableText: "Test text" }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(false)
})

it("should compare the result text if it has been amended (out of order)", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4563, ResultVariableText: "Test text" }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultVariableText: "**Test text" }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(false)
})

it("should treat different keys in results as different results", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4563, NextHearingDate: new Date() }]),
    createOffenceWithResults([{ CJSresultCode: 4563 }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(false)
})
