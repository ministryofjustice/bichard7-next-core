import createPncDisposalByThirdDuration from "./createPncDisposalByThirdDuration"
import generateAhoFromOffenceList from "../../../../../tests/fixtures/helpers/generateAhoFromOffenceList"
import validateAmountSpecifiedInResult from "./validateAmountSpecifiedInResult"
import type { Offence, Result } from "../../../../../../types/AnnotatedHearingOutcome"
import DateSpecifiedInResultSequence from "../../../../../../types/DateSpecifiedInResultSequence"

jest.mock("./validateAmountSpecifiedInResult")

const mockedValidateAmountSpecifiedInResult = validateAmountSpecifiedInResult as jest.Mock

describe("createPncDisposalByThirdDuration", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("when the result doesn't have a third duration", () => {
    it("returns undefined", () => {
      const aho = generateAhoFromOffenceList([
        {
          Result: [
            {
              ResultQualifierVariable: [] as unknown,
              Duration: [
                { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
                { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
              ],
              AmountSpecifiedInResult: [{ Amount: 1 }, { Amount: 2 }]
            } as Result
          ]
        } as Offence
      ])

      const pncDisposal = createPncDisposalByThirdDuration(aho, 0, 0, "Validated disposal text")

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
      const aho = generateAhoFromOffenceList([{ Result: [resultWithThirdDuration] } as Offence])

      createPncDisposalByThirdDuration(aho, 0, 0, "Validated disposal text")

      expect(mockedValidateAmountSpecifiedInResult).toHaveBeenCalledWith(aho, 0, 0, 2)
    })

    it("returns a PNC disposal", () => {
      const aho = generateAhoFromOffenceList([{ Result: [resultWithThirdDuration] } as Offence])

      mockedValidateAmountSpecifiedInResult.mockReturnValue(amountForThirdDuration)

      const pncDisposal = createPncDisposalByThirdDuration(aho, 0, 0, "Validated disposal text")

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
      const aho = generateAhoFromOffenceList([
        {
          Result: [
            {
              ...resultWithThirdDuration,
              DateSpecifiedInResult: [
                { Date: new Date("2024-03-01"), Sequence: DateSpecifiedInResultSequence.FirstStartDate },
                { Date: new Date("2024-03-11"), Sequence: DateSpecifiedInResultSequence.FirstEndDate },
                { Date: new Date("2024-03-23"), Sequence: DateSpecifiedInResultSequence.SecondStartDate }
              ]
            }
          ]
        } as Offence
      ])

      const pncDisposal = createPncDisposalByThirdDuration(aho, 0, 0, "Validated disposal text")

      expect(pncDisposal?.qtyDate).toBe("23032024")
    })

    it("returns a PNC disposal with the second end date specified in the result if no second start date", () => {
      const aho = generateAhoFromOffenceList([
        {
          Result: [
            {
              ...resultWithThirdDuration,
              DateSpecifiedInResult: [
                { Date: new Date("2024-03-01"), Sequence: DateSpecifiedInResultSequence.FirstStartDate },
                { Date: new Date("2024-10-10"), Sequence: DateSpecifiedInResultSequence.SecondEndDate },
                { Date: new Date("2024-05-07"), Sequence: DateSpecifiedInResultSequence.FirstEndDate }
              ]
            }
          ]
        } as Offence
      ])

      const pncDisposal = createPncDisposalByThirdDuration(aho, 0, 0, "Validated disposal text")

      expect(pncDisposal?.qtyDate).toBe("10102024")
    })
  })
})
