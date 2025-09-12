import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import DateSpecifiedInResultSequence from "../../../types/DateSpecifiedInResultSequence"
import createPoliceDisposalByThirdDuration from "./createPoliceDisposalByThirdDuration"

describe("createPoliceDisposalByThirdDuration", () => {
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

      const disposal = createPoliceDisposalByThirdDuration(hoResult, "Validated disposal text")

      expect(disposal).toBeUndefined()
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

      const disposal = createPoliceDisposalByThirdDuration(hoResult, "Validated disposal text")

      expect(disposal).toBeDefined()
      expect(disposal?.qtyMonetaryValue).toBeUndefined()
    })

    it("returns a disposal", () => {
      const disposal = createPoliceDisposalByThirdDuration(resultWithThirdDuration, "Validated disposal text")

      expect(disposal).toStrictEqual({
        qtyDate: "",
        qtyDuration: "H1",
        qtyMonetaryValue: `${amountForThirdDuration}`,
        qtyUnitsFined: `H1          000000${amountForThirdDuration}.0000`,
        qualifiers: "",
        text: "Validated disposal text",
        type: undefined
      })
    })

    it("returns a disposal with the second start date specified in the result", () => {
      const hoResult = {
        ...resultWithThirdDuration,
        DateSpecifiedInResult: [
          { Date: new Date("2024-03-01"), Sequence: DateSpecifiedInResultSequence.FirstStartDate },
          { Date: new Date("2024-03-11"), Sequence: DateSpecifiedInResultSequence.FirstEndDate },
          { Date: new Date("2024-03-23"), Sequence: DateSpecifiedInResultSequence.SecondStartDate }
        ]
      } as Result

      const disposal = createPoliceDisposalByThirdDuration(hoResult, "Validated disposal text")

      expect(disposal?.qtyDate).toBe("23032024")
    })

    it("returns a disposal with the second end date specified in the result if no second start date", () => {
      const hoResult = {
        ...resultWithThirdDuration,
        DateSpecifiedInResult: [
          { Date: new Date("2024-03-01"), Sequence: DateSpecifiedInResultSequence.FirstStartDate },
          { Date: new Date("2024-10-10"), Sequence: DateSpecifiedInResultSequence.SecondEndDate },
          { Date: new Date("2024-05-07"), Sequence: DateSpecifiedInResultSequence.FirstEndDate }
        ]
      } as Result

      const disposal = createPoliceDisposalByThirdDuration(hoResult, "Validated disposal text")

      expect(disposal?.qtyDate).toBe("10102024")
    })
  })
})
