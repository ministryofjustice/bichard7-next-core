import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import DateSpecifiedInResultSequence from "../../../../../../types/DateSpecifiedInResultSequence"
import createPncDisposalByThirdDuration from "./createPncDisposalByThirdDuration"

describe("createPncDisposalByThirdDuration", () => {
  describe("when the result doesn't have a third duration", () => {
    it("returns undefined", () => {
      const hoResult = {
        ResultQualifierVariable: [] as unknown,
        Duration: [
          { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
          { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
        ],
        AmountSpecifiedInResult: [{ Amount: 1 }, { Amount: 2 }]
      } as Result

      const pncDisposal = createPncDisposalByThirdDuration(hoResult, "Validated disposal text")

      expect(pncDisposal).toBeUndefined()
    })
  })

  describe("when the result does have a third duration", () => {
    const amountForThirdDuration = 3
    const resultWithThirdDuration = {
      ResultQualifierVariable: [] as unknown,
      Duration: [
        { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
        { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 },
        { DurationType: "Duration", DurationUnit: "H", DurationLength: 1 }
      ],
      AmountSpecifiedInResult: [{ Amount: 1 }, { Amount: 2 }, { Amount: amountForThirdDuration }]
    } as Result

    it("validates the amount for the third duration", () => {
      const hoResult = {
        ...resultWithThirdDuration,
        AmountSpecifiedInResult: [{ Amount: 11 }, { Amount: 11 }, { Amount: 12345678.1 }],
        DateSpecifiedInResult: [
          { Date: new Date("2024-03-01"), Sequence: DateSpecifiedInResultSequence.FirstStartDate },
          { Date: new Date("2024-03-11"), Sequence: DateSpecifiedInResultSequence.FirstEndDate },
          { Date: new Date("2024-03-23"), Sequence: DateSpecifiedInResultSequence.SecondStartDate }
        ]
      } as Result

      const pncDisposal = createPncDisposalByThirdDuration(hoResult, "Validated disposal text")

      expect(pncDisposal).toBeDefined()
      expect(pncDisposal?.qtyMonetaryValue).toBeUndefined()
    })

    it("returns a PNC disposal", () => {
      const pncDisposal = createPncDisposalByThirdDuration(resultWithThirdDuration, "Validated disposal text")

      expect(pncDisposal).toStrictEqual({
        qtyDate: "",
        qtyDuration: "H1",
        qtyMonetaryValue: `${amountForThirdDuration}`,
        qtyUnitsFined: `H1          000000${amountForThirdDuration}.0000`,
        qualifiers: "",
        text: "Validated disposal text",
        type: undefined
      })
    })

    it("returns a PNC disposal with the second start date specified in the result", () => {
      const hoResult = {
        ...resultWithThirdDuration,
        DateSpecifiedInResult: [
          { Date: new Date("2024-03-01"), Sequence: DateSpecifiedInResultSequence.FirstStartDate },
          { Date: new Date("2024-03-11"), Sequence: DateSpecifiedInResultSequence.FirstEndDate },
          { Date: new Date("2024-03-23"), Sequence: DateSpecifiedInResultSequence.SecondStartDate }
        ]
      } as Result

      const pncDisposal = createPncDisposalByThirdDuration(hoResult, "Validated disposal text")

      expect(pncDisposal?.qtyDate).toBe("23032024")
    })

    it("returns a PNC disposal with the second end date specified in the result if no second start date", () => {
      const hoResult = {
        ...resultWithThirdDuration,
        DateSpecifiedInResult: [
          { Date: new Date("2024-03-01"), Sequence: DateSpecifiedInResultSequence.FirstStartDate },
          { Date: new Date("2024-10-10"), Sequence: DateSpecifiedInResultSequence.SecondEndDate },
          { Date: new Date("2024-05-07"), Sequence: DateSpecifiedInResultSequence.FirstEndDate }
        ]
      } as Result

      const pncDisposal = createPncDisposalByThirdDuration(hoResult, "Validated disposal text")

      expect(pncDisposal?.qtyDate).toBe("10102024")
    })
  })
})
