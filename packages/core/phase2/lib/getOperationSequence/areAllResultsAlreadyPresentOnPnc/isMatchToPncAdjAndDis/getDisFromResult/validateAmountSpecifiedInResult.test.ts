import type { Offence } from "../../../../../../types/AnnotatedHearingOutcome"
import generateAhoFromOffenceList from "../../../../../tests/fixtures/helpers/generateAhoFromOffenceList"
import validateAmountSpecifiedInResult from "./validateAmountSpecifiedInResult"

describe("validateAmountSpecifiedInResult", () => {
  it("should return AmountSpecifiedInResult.Amount and not generate exception when amount is less than 11 characters and integral part is less than 8 characters", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            AmountSpecifiedInResult: [
              { Amount: 1234567.8911 },
              { Amount: 1234567.8911 },
              { Amount: 1234567.89 },
              { Amount: 1234567.8911 }
            ]
          }
        ]
      } as Offence
    ])

    const amount = validateAmountSpecifiedInResult(aho, 0, 0, 2)

    expect(amount).toBe(1234567.89)
    expect(aho.Exceptions).toHaveLength(0)
  })

  it("should return undefined and not generate exception when AmountSpecifiedInResult.Amount is undefined", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            AmountSpecifiedInResult: [
              { Amount: 1234567.8911 },
              { Amount: 1234567.8911 },
              { Amount: undefined },
              { Amount: 1234567.8911 }
            ]
          }
        ]
      } as Offence
    ])

    const amount = validateAmountSpecifiedInResult(aho, 0, 0, 2)

    expect(amount).toBeUndefined()
    expect(aho.Exceptions).toHaveLength(0)
  })

  it.each([
    {
      when: "integral part length is 8 characters and total length is 10 characters",
      amount: 12345678.9
    },
    { when: "integral part length is 8 characters without decimal part", amount: 12345678 },
    { when: "integral part length is 7 characters but total length is 11 characters", amount: 1234567.891 },
    // prettier-ignore
    { when: "integral part is missing and total length is 10 characters", amount: .123456789 },
    { when: "integral part length is 1 character and total length is 10 characters", amount: 0.123456789 }
  ])(
    "should return undefined and generate exception HO200205 when AmountSpecifiedInResult.Amount $when",
    ({ amount }) => {
      const aho = generateAhoFromOffenceList([
        {
          Result: [
            {
              AmountSpecifiedInResult: [{ Amount: 1234567.12 }, { Amount: amount }]
            }
          ]
        } as Offence
      ])

      const amountResult = validateAmountSpecifiedInResult(aho, 0, 0, 1)

      expect(amountResult).toBeUndefined()
      expect(aho.Exceptions).toStrictEqual([
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
            1
          ]
        }
      ])
    }
  )
})
