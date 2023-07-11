import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import { compareTwoResults, offencesHaveEqualResults } from "./resultsAreEqual"

const createResult = (resultCode: number, date: Date, adjudicationExists?: boolean): Result => {
  const result: Partial<Result> = {
    CJSresultCode: resultCode,
    ResultHearingDate: new Date(date)
  }

  if (adjudicationExists !== undefined) {
    result.PNCAdjudicationExists = adjudicationExists
  }

  return result as Result
}

const createOffenceWithResults = (results: Partial<Result>[]): Offence => {
  return {
    Result: results.map((result) => createResult(result.CJSresultCode!, result.ResultHearingDate!))
  } as Offence
}

it("should testResultsEqualResultsVariantAllFieldsDifferent()", () => {
  const r1 = createResult(7520, new Date("2019-09-09"))
  const r2 = createResult(4520, new Date("2009-09-09"), true)
  const result = compareTwoResults(r1, r2, true)
  expect(result).toBe(false)
})

it("should testResultsEqualResultsVariantAllFieldsDifferentExceptAdjudication()", () => {
  const r1 = createResult(4563, new Date("2009-09-09"), true)
  const r2 = createResult(5563, new Date("2009-09-10"), true)
  const result = compareTwoResults(r1, r2, true)
  expect(result).toBe(false)
})

it("should testResultsEqualResultsVariantAllFieldsDifferentExceptDate()", () => {
  const r1 = createResult(4563, new Date("2009-09-09"), true)
  const r2 = createResult(4263, new Date("2009-09-09"))
  const result = compareTwoResults(r1, r2, true)
  expect(result).toBe(false)
})

it("should testResultsEqualResultsVariantAllFieldsDifferentExceptResultCode()", () => {
  const r1 = createResult(4520, new Date("2019-09-09"))
  const r2 = createResult(4520, new Date("2009-09-09"), true)
  const result = compareTwoResults(r1, r2, true)
  expect(result).toBe(false)
})

it("should testResultsEqualResultsVariantAllFieldsSame()", () => {
  const r1 = createResult(4563, new Date("2009-09-09"), true)
  const r2 = createResult(4563, new Date("2009-09-09"), true)
  const result = compareTwoResults(r1, r2, true)
  expect(result).toBe(true)
})

it("should testResultsEqualResultsVariantAllFieldsSameExceptAdjudication()", () => {
  const r1 = createResult(4563, new Date("2009-09-09"), true)
  const r2 = createResult(4563, new Date("2009-09-09"), false)
  const result = compareTwoResults(r1, r2, true)
  expect(result).toBe(true)
})

it("should testResultsEqualResultsVariantAllFieldsSameExceptDate()", () => {
  const r1 = createResult(4563, new Date("2009-09-09"), true)
  const r2 = createResult(4563, new Date("2009-09-10"), true)
  const result = compareTwoResults(r1, r2, true)
  expect(result).toBe(false)
})

it("should testResultsEqualResultsVariantAllFieldsSameExceptResultCode()", () => {
  const r1 = createResult(4563, new Date("2009-09-09"), true)
  const r2 = createResult(4520, new Date("2009-09-09"), true)
  const result = compareTwoResults(r1, r2, true)
  expect(result).toBe(false)
})

it("should testResultsEqualListVariantEmptyList()", () => {
  const result = offencesHaveEqualResults([])
  expect(result).toBe(true)
})

it("should testResultsEqualListVariantOneEntry()", () => {
  const input = [createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }])]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(true)
})

it("should testResultsEqualListVariantSeveralEntriesFirstOneIsUnequal()", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4562, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(false)
})

it("should testResultsEqualListVariantSeveralEntriesLastOneIsUnequal()", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4562, ResultHearingDate: new Date("2010-10-10") }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(false)
})

it("should testResultsEqualListVariantSeveralEqualEntries()", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(true)
})

it("should testResultsEqualListVariantTwoEntriesWithDifferentNumbersOfResults()", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([
      { CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") },
      { CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }
    ])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(false)
})

it("should testResultsEqualListVariantTwoEntriesWithDifferentNumbersOfResults() swapped", () => {
  const input = [
    createOffenceWithResults([
      { CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") },
      { CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }
    ]),
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(false)
})

it("should testResultsEqualListVariantTwoUnequalEntries()", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4563, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([{ CJSresultCode: 4573, ResultHearingDate: new Date("2010-10-10") }])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(false)
})

// Check that order of results is not significant - all results recordable
it("should testResultsEqualListVariantTwoEntriesWithIdenticalResultsInDifferentOrder()", () => {
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
it("should testResultsEqualListVariantTwoEntriesMatchWhenNonRecordableResultsAreDiscounted1()", () => {
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

// Check that non-recordable results are ignored during matching
it("should testResultsEqualListVariantTwoEntriesMatchWhenNonRecordableResultsAreDiscounted2()", () => {
  const input = [
    createOffenceWithResults([{ CJSresultCode: 4562, ResultHearingDate: new Date("2010-10-10") }]),
    createOffenceWithResults([
      { CJSresultCode: 4562, ResultHearingDate: new Date("2010-10-10") },
      { CJSresultCode: 3501, ResultHearingDate: new Date("2010-10-10") }
    ])
  ]
  const result = offencesHaveEqualResults(input)
  expect(result).toBe(true)
})

// Check that non-recordable results are ignored during matching (all results non-recordable)
it("should testResultsEqualListVariantTwoEntriesMatchWhenNonRecordableResultsAreDiscounted3()", () => {
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
