import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import HO200205 from "./HO200205"

const generateAho = (numberOfDurations?: number, amounts?: number[]) => {
  const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
  const durations =
    numberOfDurations === undefined
      ? undefined
      : Array(numberOfDurations)
          .fill(0)
          .map(() => ({ DurationType: "dummy", DurationUnit: "dummy", DurationLength: 1 }))
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
    { when: "first amount specified in result is valid", durations: 0, amounts: [1234567.1] },
    {
      when: "third duration exists and third amount specified in result is valid",
      durations: 3,
      amounts: [1234567.1, 1234567.1, 1234567.1]
    },
    {
      when: "third amount specified in result is invalid but there are only 2 durations in result",
      durations: 2,
      amounts: [1234567.1, 1234567.1, 12345678.1]
    },
    {
      when: "third amount specified in result is invalid but durations in result are undefined",
      durations: undefined,
      amounts: [1234567.1, 1234567.1, 12345678.1]
    },
    {
      when: "there are no amounts specified in result",
      durations: 3,
      amounts: []
    },
    {
      when: "amount specified in result is undefined",
      durations: 3,
      amounts: undefined
    }
  ])("should not return exception when $when", ({ durations, amounts }) => {
    const aho = generateAho(durations, amounts)

    const exceptions = HO200205(aho)

    expect(exceptions).toHaveLength(0)
  })
})
