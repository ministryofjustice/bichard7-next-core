jest.mock("./getFirstDateSpecifiedInResult")
jest.mock("../../getDisposalTextFromResult")
jest.mock("./isDriverDisqualificationResult")
jest.mock("./validateAmountSpecifiedInResult")
jest.mock("./validateDisposalText")

import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import getDisposalTextFromResult from "../../processAho/getDisposalTextFromResult"
import generateAhoFromOffenceList from "../../tests/fixtures/helpers/generateAhoFromOffenceList"
import createPncDisposalByFirstAndSecondDurations from "./createPncDisposalByFirstAndSecondDurations"
import getFirstDateSpecifiedInResult from "./getFirstDateSpecifiedInResult"
import isDriverDisqualificationResult from "./isDriverDisqualificationResult"
import validateAmountSpecifiedInResult from "./validateAmountSpecifiedInResult"
import validateDisposalText from "./validateDisposalText"

const mockedValidateAmountSpecifiedInResult = validateAmountSpecifiedInResult as jest.Mock
const mockedGetFirstDateSpecifiedInResult = getFirstDateSpecifiedInResult as jest.Mock
const mockedGetDisposalTextFromResult = getDisposalTextFromResult as jest.Mock
const mockedIsDriverDisqualificationResult = isDriverDisqualificationResult as jest.Mock
const mockedValidateDisposalText = validateDisposalText as jest.Mock

describe("createPncDisposalByFirstAndSecondDurations", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockedValidateDisposalText.mockImplementation((disposalText) => `ValidateDisposalText(${disposalText})`)
  })

  it("should return PNC disposal when disposal text has value and is valid", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            ResultQualifierVariable: [] as unknown,
            Duration: [
              { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
              { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
            ]
          } as Result
        ]
      } as Offence
    ])

    mockedValidateAmountSpecifiedInResult.mockReturnValue(11)
    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(true)
    mockedGetDisposalTextFromResult.mockReturnValue("Dummy disposal text")

    const pncDisposal = createPncDisposalByFirstAndSecondDurations(aho, 0, 0)

    expect(pncDisposal).toStrictEqual({
      qtyDate: "10052024",
      qtyDuration: "D3",
      qtyMonetaryValue: "11",
      qtyUnitsFined: "D3          0000011.0000",
      qualifiers: "H5",
      text: "Dummy disposal text",
      type: undefined
    })
  })

  it("should return PNC disposal when ResultVariableText has value and is valid", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            ResultVariableText: "Dummy text",
            ResultQualifierVariable: [] as unknown,
            Duration: [
              { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
              { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
            ]
          } as Result
        ]
      } as Offence
    ])

    mockedValidateAmountSpecifiedInResult.mockReturnValue(11)
    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(true)
    mockedGetDisposalTextFromResult.mockReturnValue("Dummy disposal text")

    const pncDisposal = createPncDisposalByFirstAndSecondDurations(aho, 0, 0)

    expect(mockedValidateDisposalText).toHaveBeenCalledTimes(1)
    expect(pncDisposal).toStrictEqual({
      qtyDate: "10052024",
      qtyDuration: "D3",
      qtyMonetaryValue: "11",
      qtyUnitsFined: "D3          0000011.0000",
      qualifiers: "H5",
      text: "ValidateDisposalText(Dummy disposal text)",
      type: undefined
    })
  })

  it("should return PNC disposal and validate disposal text when disposal text has value and is valid", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            ResultQualifierVariable: [] as unknown,
            Duration: [
              { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
              { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
            ]
          } as Result
        ]
      } as Offence
    ])

    mockedValidateAmountSpecifiedInResult.mockReturnValue(11)
    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(true)
    mockedGetDisposalTextFromResult.mockReturnValue("Dummy disposal text")

    const pncDisposal = createPncDisposalByFirstAndSecondDurations(aho, 0, 0)

    expect(pncDisposal).toStrictEqual({
      qtyDate: "10052024",
      qtyDuration: "D3",
      qtyMonetaryValue: "11",
      qtyUnitsFined: "D3          0000011.0000",
      qualifiers: "H5",
      text: "Dummy disposal text",
      type: undefined
    })
  })

  it("should return PNC disposal and use DateSpecifiedInResult for disposal text when disposal text does not have value", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            ResultQualifierVariable: [] as unknown,
            Duration: [
              { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
              { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
            ]
          } as Result
        ]
      } as Offence
    ])

    mockedValidateAmountSpecifiedInResult.mockReturnValue(11)
    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(true)
    mockedGetDisposalTextFromResult.mockReturnValue(undefined)

    const pncDisposal = createPncDisposalByFirstAndSecondDurations(aho, 0, 0)

    expect(pncDisposal).toStrictEqual({
      qtyDate: "",
      qtyDuration: "D3",
      qtyMonetaryValue: "11",
      qtyUnitsFined: "D3          0000011.0000",
      qualifiers: "H5",
      text: "from 10/05/2024",
      type: undefined
    })
  })
})
