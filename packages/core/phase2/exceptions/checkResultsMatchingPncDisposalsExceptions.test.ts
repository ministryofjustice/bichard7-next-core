import type { GenerateAhoMatchingPncAdjudicationAndDisposalsOptions } from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import checkResultsMatchingPncDisposalsExceptions from "./checkResultsMatchingPncDisposalsExceptions"

type TestInput = GenerateAhoMatchingPncAdjudicationAndDisposalsOptions & { when: string }

describe("checkResultsMatchingPncDisposalsExceptions", () => {
  it("should call the exception check function when the PNC adjudication matches", () => {
    const exceptionCheckFn = jest.fn()
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ hasPncId: true })

    checkResultsMatchingPncDisposalsExceptions(aho, exceptionCheckFn)

    expect(exceptionCheckFn).toHaveBeenCalledTimes(2)
  })

  it.each([
    { when: "PNC ID is not set", hasPncId: false },
    { when: "case has no offences", hasOffences: false },
    { when: "offence has no results", hasResults: false },
    { when: "offence sequence number is not set", hasOffenceReasonSequence: false },
    { when: "PNC case has no offences", hasPncOffences: false },
    { when: "case has no matching PNC adjudication", hasMatchingPncAdjudication: false }
  ] satisfies TestInput[])("should not call the exception check function when $when", (options) => {
    const exceptionCheckFn = jest.fn()
    const aho = generateAhoMatchingPncAdjudicationAndDisposals(options)

    checkResultsMatchingPncDisposalsExceptions(aho, exceptionCheckFn)

    expect(exceptionCheckFn).toHaveBeenCalledTimes(0)
  })

  it("should call the exception check function once when the first result is recordable and does not match a PNC disposal", () => {
    const exceptionCheckFn = jest.fn()
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      firstResultDisposalType: 2063,
      firstPncDisposalType: 2060
    })

    checkResultsMatchingPncDisposalsExceptions(aho, exceptionCheckFn)

    expect(exceptionCheckFn).toHaveBeenCalledTimes(1)
  })

  it("should call the exception check function twice when the first result is recordable but matches a PNC disposal", () => {
    const exceptionCheckFn = jest.fn()
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      firstResultDisposalType: 2063,
      firstPncDisposalType: 2063
    })

    checkResultsMatchingPncDisposalsExceptions(aho, exceptionCheckFn)

    expect(exceptionCheckFn).toHaveBeenCalledTimes(2)
  })

  it("should call the exception check function twice when the first result does not match a PNC disposal but is non-recordable", () => {
    const exceptionCheckFn = jest.fn()
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      firstResultDisposalType: 1000,
      firstPncDisposalType: 2063
    })

    checkResultsMatchingPncDisposalsExceptions(aho, exceptionCheckFn)

    expect(exceptionCheckFn).toHaveBeenCalledTimes(2)
  })
})
