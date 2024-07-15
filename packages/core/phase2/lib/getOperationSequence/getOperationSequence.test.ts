jest.mock("./areAllResultsAlreadyPresentOnPnc")
jest.mock("./deriveOperationSequence")
jest.mock("./validateOperationSequence/validateOperationSequence")
import { Offence } from "../../../types/AnnotatedHearingOutcome"
import generateAhoFromOffenceList from "../../tests/fixtures/helpers/generateAhoFromOffenceList"
import { areAllResultsAlreadyPresentOnPnc } from "./areAllResultsAlreadyPresentOnPnc"
import { deriveOperationSequence } from "./deriveOperationSequence"
import getOperationSequence from "./getOperationSequence"
import validateOperationSequence from "./validateOperationSequence/validateOperationSequence"

const mockedAreAllResultsAlreadyPresentOnPnc = areAllResultsAlreadyPresentOnPnc as jest.Mock
const mockedDeriveOperationSequence = deriveOperationSequence as jest.Mock
const mockedValidateOperationSequence = validateOperationSequence as jest.Mock

describe("getOperationSequence", () => {
  it("should return empty array when checkNoSequenceConditions generates exception", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [{}]
      }
    ] as Offence[])
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = true
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = "0000NRPRAAAAAAAAAAAA"

    const result = getOperationSequence(aho, true)

    expect(result).toHaveLength(0)
  })

  it("should only return NEWREM operations when results are already on PNC", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [{}]
      }
    ] as Offence[])
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = false
    mockedAreAllResultsAlreadyPresentOnPnc.mockReturnValue(true)
    mockedDeriveOperationSequence.mockReturnValue([
      { code: "DISARR" },
      { code: "NEWREM", data: { dummy: "1" } },
      { code: "NEWREM", data: { dummy: "2" } }
    ])

    const result = getOperationSequence(aho, true)

    console.log(result)
    expect(result).toStrictEqual([
      { code: "NEWREM", data: { dummy: "1" } },
      { code: "NEWREM", data: { dummy: "2" } }
    ])
    expect(mockedValidateOperationSequence).toHaveBeenCalledWith(
      [{ code: "DISARR" }, { code: "NEWREM", data: { dummy: "1" } }, { code: "NEWREM", data: { dummy: "2" } }],
      true,
      aho,
      new Set<string>()
    )
  })

  it("should sort and return operations when results are not already on PNC", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [{}]
      }
    ] as Offence[])
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = false
    mockedAreAllResultsAlreadyPresentOnPnc.mockReturnValue(false)
    mockedDeriveOperationSequence.mockReturnValue([
      { code: "NEWREM", data: { dummy: "1" } },
      { code: "DISARR" },
      { code: "NEWREM", data: { dummy: "2" } }
    ])

    const result = getOperationSequence(aho, true)

    console.log(result)
    expect(result).toStrictEqual([
      { code: "DISARR" },
      { code: "NEWREM", data: { dummy: "1" } },
      { code: "NEWREM", data: { dummy: "2" } }
    ])
    expect(mockedValidateOperationSequence).toHaveBeenCalledWith(
      [{ code: "NEWREM", data: { dummy: "1" } }, { code: "DISARR" }, { code: "NEWREM", data: { dummy: "2" } }],
      false,
      aho,
      new Set<string>()
    )
  })
})
