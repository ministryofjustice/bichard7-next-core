import getComparisonStatistics from "./getComparisonStatistics"
import type { SkippedFile } from "./processRange"

const passingAhoResult = {
  triggersMatch: true,
  exceptionsMatch: true,
  xmlOutputMatches: true,
  xmlParsingMatches: true,
  incomingMessageType: "AnnotatedHearingOutcome"
}

const failedAhoResult = {
  triggersMatch: true,
  exceptionsMatch: true,
  xmlOutputMatches: false,
  xmlParsingMatches: true,
  incomingMessageType: "AnnotatedHearingOutcome"
}

const failedResult = {
  triggersMatch: true,
  exceptionsMatch: true,
  xmlOutputMatches: false,
  xmlParsingMatches: true
}

const intentionalFailedResult = {
  triggersMatch: true,
  exceptionsMatch: true,
  xmlOutputMatches: false,
  xmlParsingMatches: true,
  intentionalDifference: true
}

const passingResult = {
  triggersMatch: true,
  exceptionsMatch: true,
  xmlOutputMatches: true,
  xmlParsingMatches: true
}

const passingOtherResult = {
  triggersMatch: true,
  exceptionsMatch: true,
  xmlOutputMatches: true,
  xmlParsingMatches: true,
  incomingMessageType: "Other"
}

const skippedResult: SkippedFile = {
  file: "foo",
  skipped: true
}

describe("check getComparisonStatistics", () => {
  it("given 10 passing results with AHO file type, should be correct", () => {
    const results = Array(10).fill(passingAhoResult)
    const result = getComparisonStatistics(results)

    expect(result).toStrictEqual({
      errored: 0,
      expectedPassed: 10,
      expectedPassedAho: 10,
      failed: 0,
      intentional: 0,
      passed: 10,
      passedAho: 10,
      skipped: 0,
      total: 10
    })
  })
  it("given 10 passing results with no file type, should be correct", () => {
    const results = Array(10).fill(passingResult)
    const result = getComparisonStatistics(results)

    expect(result).toStrictEqual({
      errored: 0,
      expectedPassed: 10,
      expectedPassedAho: 0,
      failed: 0,
      intentional: 0,
      passed: 10,
      passedAho: 0,
      skipped: 0,
      total: 10
    })
  })
  it("given 10 passing results with other file type, should be correct", () => {
    const results = Array(10).fill(passingOtherResult)
    const result = getComparisonStatistics(results)

    expect(result).toStrictEqual({
      errored: 0,
      expectedPassed: 10,
      expectedPassedAho: 0,
      failed: 0,
      intentional: 0,
      passed: 10,
      passedAho: 0,
      skipped: 0,
      total: 10
    })
  })
  it("given 1 passing and 1 failing result, should be correct", () => {
    const results = [passingResult, failedResult]
    const result = getComparisonStatistics(results)

    expect(result).toStrictEqual({
      errored: 0,
      expectedPassed: 2,
      expectedPassedAho: 0,
      failed: 1,
      intentional: 0,
      passed: 1,
      passedAho: 0,
      skipped: 0,
      total: 2
    })
  })
  it("given 1 passing and 1 failing Aho result, should be correct", () => {
    const results = [passingResult, failedAhoResult]
    const result = getComparisonStatistics(results)

    expect(result).toStrictEqual({
      errored: 0,
      expectedPassed: 2,
      expectedPassedAho: 1,
      failed: 1,
      intentional: 0,
      passed: 1,
      passedAho: 0,
      skipped: 0,
      total: 2
    })
  })
  it("given 1 passing and 1 skipped result, should be correct", () => {
    const results = [passingResult, skippedResult]
    const result = getComparisonStatistics(results)

    expect(result).toStrictEqual({
      errored: 0,
      expectedPassed: 1,
      expectedPassedAho: 0,
      failed: 0,
      intentional: 0,
      passed: 1,
      passedAho: 0,
      skipped: 1,
      total: 2
    })
  })
  it("given 1 passing, 1 failing and 1 intentional difference result, should be correct", () => {
    const results = [passingResult, failedResult, intentionalFailedResult]
    const result = getComparisonStatistics(results)

    expect(result).toStrictEqual({
      errored: 0,
      expectedPassed: 2,
      expectedPassedAho: 0,
      failed: 1,
      intentional: 1,
      passed: 1,
      passedAho: 0,
      skipped: 0,
      total: 3
    })
  })
})
