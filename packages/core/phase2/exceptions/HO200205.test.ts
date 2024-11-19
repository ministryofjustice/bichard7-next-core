import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import HO200205 from "./HO200205"

const generateAho = (numberOfDurations?: number, amounts?: number[]) => {
  const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
  const durations =
    numberOfDurations === undefined
      ? undefined
      : Array(numberOfDurations)
          .fill(0)
          .map(() => ({ DurationLength: 1, DurationType: "dummy", DurationUnit: "dummy" }))
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].Duration = durations
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].AmountSpecifiedInResult =
    amounts?.map((amount) => ({ Amount: amount, DecimalPlaces: 1 }))

  return aho
}

describe("HO200205", () => {
  it("should return exception when first amount specified in result is invalid", () => {
    const aho = generateAho(0, [12345678.1])

    const exceptions = HO200205(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200205",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "AmountSpecifiedInResult",
          0
        ]
      }
    ])
  })

  it("should return exception when third duration exists and third amount specified in result is invalid", () => {
    const aho = generateAho(3, [1234.1, 1234.1, 12345678.1])

    const exceptions = HO200205(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200205",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "AmountSpecifiedInResult",
          2
        ]
      }
    ])
  })

  it("should return 2 exceptions when both first and third amounts specified in result are invalid and third duration exists", () => {
    const aho = generateAho(3, [123456789.1, 1234.1, 12345678.1])

    const exceptions = HO200205(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200205",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "AmountSpecifiedInResult",
          0
        ]
      },
      {
        code: "HO200205",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "AmountSpecifiedInResult",
          2
        ]
      }
    ])
  })

  it.each([
    { amounts: [1234567.1], durations: 0, when: "first amount specified in result is valid" },
    {
      amounts: [1234567.1, 1234567.1, 1234567.1],
      durations: 3,
      when: "third duration exists and third amount specified in result is valid"
    },
    {
      amounts: [1234567.1, 1234567.1, 12345678.1],
      durations: 2,
      when: "third amount specified in result is invalid but there are only 2 durations in result"
    },
    {
      amounts: [1234567.1, 1234567.1, 12345678.1],
      durations: undefined,
      when: "third amount specified in result is invalid but durations in result are undefined"
    },
    {
      amounts: [],
      durations: 3,
      when: "there are no amounts specified in result"
    },
    {
      amounts: undefined,
      durations: 3,
      when: "amount specified in result is undefined"
    }
  ])("should not return exception when $when", ({ amounts, durations }) => {
    const aho = generateAho(durations, amounts)

    const exceptions = HO200205(aho)

    expect(exceptions).toHaveLength(0)
  })
})
