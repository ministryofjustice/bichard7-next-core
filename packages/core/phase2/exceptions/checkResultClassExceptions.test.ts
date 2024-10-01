import type { Offence } from "../../types/AnnotatedHearingOutcome"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import checkResultClassExceptions from "./checkResultClassExceptions"

describe("checkResultClassExceptions", () => {
  it("should call check exception function when offence and result are recordable", () => {
    const checkException = jest.fn()
    const offence = {
      CriminalProsecutionReference: {
        OffenceReasonSequence: "1"
      },
      Result: [{ PNCDisposalType: 1000 }, { PNCDisposalType: 2068 }]
    } as Offence
    const nonRecordableOffence = {
      OffenceCategory: "B7",
      Result: [{ PNCDisposalType: 2068 }]
    } as Offence
    const aho = generateAhoFromOffenceList([nonRecordableOffence, offence])

    checkResultClassExceptions(aho, checkException)

    expect(checkException).toHaveBeenCalledWith(offence, offence.Result[1], 1, 1)
  })

  it("should not call check exception function when offence is recordable but result is non-recordable", () => {
    const checkException = jest.fn()
    const offence = {
      CriminalProsecutionReference: {
        OffenceReasonSequence: "1"
      },
      Result: [{ PNCDisposalType: 1000 }]
    } as Offence
    const aho = generateAhoFromOffenceList([offence])

    checkResultClassExceptions(aho, checkException)

    expect(checkException).toHaveBeenCalledTimes(0)
  })

  it("should not call check exception function when result is recordable but offence is non-recordable", () => {
    const checkException = jest.fn()
    const offence = {
      OffenceCategory: "B7",
      Result: [{ PNCDisposalType: 2068 }]
    } as Offence
    const aho = generateAhoFromOffenceList([offence])

    checkResultClassExceptions(aho, checkException)

    expect(checkException).toHaveBeenCalledTimes(0)
  })

  it("should not call check exception function when both offence and result are non-recordable", () => {
    const checkException = jest.fn()
    const offence = {
      OffenceCategory: "B7",
      Result: [{ PNCDisposalType: 1000 }]
    } as Offence
    const aho = generateAhoFromOffenceList([offence])

    checkResultClassExceptions(aho, checkException)

    expect(checkException).toHaveBeenCalledTimes(0)
  })
})
