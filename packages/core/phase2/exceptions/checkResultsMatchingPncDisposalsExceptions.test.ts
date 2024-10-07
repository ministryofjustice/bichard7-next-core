import type { GenerateAhoMatchingPncAdjudicationAndDisposalsOptions } from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import checkResultsMatchingPncDisposalsExceptions from "./checkResultsMatchingPncDisposalsExceptions"

type TestInput = GenerateAhoMatchingPncAdjudicationAndDisposalsOptions & { when: string }

describe("checkResultsMatchingPncDisposalsExceptions", () => {
  it("should call the check exception function when the PNC adjudication matches", () => {
    const checkExceptionFn = jest.fn()
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ hasPncId: true })

    checkResultsMatchingPncDisposalsExceptions(aho, checkExceptionFn)

    expect(checkExceptionFn).toHaveBeenCalledTimes(2)
  })

  it.each([
    { when: "PNC ID is not set", hasPncId: false },
    { when: "case has no offences", hasOffences: false },
    { when: "offence has no results", hasResults: false },
    { when: "offence sequence number is not set", hasOffenceReasonSequence: false },
    { when: "PNC case has no offences", hasPncOffences: false },
    { when: "case has no matching PNC adjudication", hasMatchingPncAdjudication: false }
  ] satisfies TestInput[])("should not call the check exception function when $when", (options) => {
    const checkExceptionFn = jest.fn()
    const aho = generateAhoMatchingPncAdjudicationAndDisposals(options)

    checkResultsMatchingPncDisposalsExceptions(aho, checkExceptionFn)

    expect(checkExceptionFn).toHaveBeenCalledTimes(0)
  })

  describe("when only one offence", () => {
    it("should call the check exception function once when the first result is recordable and does not match a PNC disposal", () => {
      const checkExceptionFn = jest.fn()
      const aho = generateAhoMatchingPncAdjudicationAndDisposals({
        firstResultDisposalType: 2063,
        firstPncDisposalType: 2060
      })

      checkResultsMatchingPncDisposalsExceptions(aho, checkExceptionFn)

      expect(checkExceptionFn).toHaveBeenCalledTimes(1)
    })

    it("should call the check exception function twice when the first result is recordable but matches a PNC disposal", () => {
      const checkExceptionFn = jest.fn()
      const aho = generateAhoMatchingPncAdjudicationAndDisposals({
        firstResultDisposalType: 2063,
        firstPncDisposalType: 2063
      })

      checkResultsMatchingPncDisposalsExceptions(aho, checkExceptionFn)

      expect(checkExceptionFn).toHaveBeenCalledTimes(2)
    })

    it("should call the check exception function twice when the first result does not match a PNC disposal but is non-recordable", () => {
      const checkExceptionFn = jest.fn()
      const aho = generateAhoMatchingPncAdjudicationAndDisposals({
        firstResultDisposalType: 1000,
        firstPncDisposalType: 2063
      })

      checkResultsMatchingPncDisposalsExceptions(aho, checkExceptionFn)

      expect(checkExceptionFn).toHaveBeenCalledTimes(2)
    })
  })

  describe("when multiple offences", () => {
    it("should call the check exception function once when the first result is recordable and does not match a PNC disposal", () => {
      const checkExceptionFn = jest.fn()
      const aho = generateAhoMatchingPncAdjudicationAndDisposals({
        firstResultDisposalType: 2063,
        firstPncDisposalType: 2060,
        hasAdditionalMatchingOffence: true
      })

      checkResultsMatchingPncDisposalsExceptions(aho, checkExceptionFn)

      expect(checkExceptionFn).toHaveBeenCalledTimes(1)
    })

    it("should call the check exception function three times when the first result is recordable but matches a PNC disposal", () => {
      const checkExceptionFn = jest.fn()
      const aho = generateAhoMatchingPncAdjudicationAndDisposals({
        firstResultDisposalType: 2063,
        firstPncDisposalType: 2063,
        hasAdditionalMatchingOffence: true
      })

      checkResultsMatchingPncDisposalsExceptions(aho, checkExceptionFn)

      expect(checkExceptionFn).toHaveBeenCalledTimes(3)
    })

    it("should call the check exception function three times when the first result does not match a PNC disposal but is non-recordable", () => {
      const checkExceptionFn = jest.fn()
      const aho = generateAhoMatchingPncAdjudicationAndDisposals({
        firstResultDisposalType: 1000,
        firstPncDisposalType: 2063,
        hasAdditionalMatchingOffence: true
      })

      checkResultsMatchingPncDisposalsExceptions(aho, checkExceptionFn)

      expect(checkExceptionFn).toHaveBeenCalledTimes(3)
    })
  })
})
