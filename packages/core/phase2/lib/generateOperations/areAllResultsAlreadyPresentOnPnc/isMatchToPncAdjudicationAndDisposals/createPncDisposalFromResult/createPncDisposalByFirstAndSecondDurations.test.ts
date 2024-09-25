jest.mock("./getFirstDateSpecifiedInResult")
jest.mock("./getDisposalTextFromResult")
jest.mock("./isDriverDisqualificationResult")
jest.mock("./validateAmountSpecifiedInResult")

import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import createPncDisposalByFirstAndSecondDurations from "./createPncDisposalByFirstAndSecondDurations"
import { getDisposalTextFromResult } from "./getDisposalTextFromResult"
import getFirstDateSpecifiedInResult from "./getFirstDateSpecifiedInResult"
import isDriverDisqualificationResult from "./isDriverDisqualificationResult"
import validateAmountSpecifiedInResult from "./validateAmountSpecifiedInResult"

const mockedValidateAmountSpecifiedInResult = validateAmountSpecifiedInResult as jest.Mock
const mockedGetFirstDateSpecifiedInResult = getFirstDateSpecifiedInResult as jest.Mock
const mockedGetDisposalTextFromResult = getDisposalTextFromResult as jest.Mock
const mockedIsDriverDisqualificationResult = isDriverDisqualificationResult as jest.Mock

describe("createPncDisposalByFirstAndSecondDurations", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should return PNC disposal when disposal text has value and is valid", () => {
    const hoResult = {
      ResultQualifierVariable: [] as unknown,
      Duration: [
        { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
        { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
      ]
    } as Result

    mockedValidateAmountSpecifiedInResult.mockReturnValue({ value: 11, exceptions: [] })
    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(true)
    mockedGetDisposalTextFromResult.mockReturnValue("Dummy disposal text")

    const pncDisposal = createPncDisposalByFirstAndSecondDurations(hoResult, 0, 0)

    expect(pncDisposal.exceptions).toStrictEqual([])
    expect(pncDisposal.value).toStrictEqual({
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
    const hoResult = {
      ResultVariableText: "Dummy text",
      ResultQualifierVariable: [] as unknown,
      Duration: [
        { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
        { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
      ]
    } as Result

    mockedValidateAmountSpecifiedInResult.mockReturnValue({ value: 11, exceptions: [] })
    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(true)
    mockedGetDisposalTextFromResult.mockReturnValue("A".repeat(65))

    const pncDisposal = createPncDisposalByFirstAndSecondDurations(hoResult, 0, 0)

    expect(pncDisposal.exceptions).toHaveLength(0)
    expect(pncDisposal.value).toStrictEqual({
      qtyDate: "10052024",
      qtyDuration: "D3",
      qtyMonetaryValue: "11",
      qtyUnitsFined: "D3          0000011.0000",
      qualifiers: "H5",
      text: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+",
      type: undefined
    })
  })

  it("should return PNC disposal and validate disposal text when disposal text has value and is valid", () => {
    const hoResult = {
      ResultQualifierVariable: [] as unknown,
      Duration: [
        { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
        { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
      ]
    } as Result

    mockedValidateAmountSpecifiedInResult.mockReturnValue({ value: 11, exceptions: [] })
    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(true)
    mockedGetDisposalTextFromResult.mockReturnValue("Dummy disposal text")

    const pncDisposal = createPncDisposalByFirstAndSecondDurations(hoResult, 0, 0)

    expect(pncDisposal.exceptions).toStrictEqual([])
    expect(pncDisposal.value).toStrictEqual({
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
    const hoResult = {
      ResultQualifierVariable: [] as unknown,
      Duration: [
        { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
        { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
      ]
    } as Result

    mockedValidateAmountSpecifiedInResult.mockReturnValue({ value: 11, exceptions: [] })
    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(true)
    mockedGetDisposalTextFromResult.mockReturnValue(undefined)

    const pncDisposal = createPncDisposalByFirstAndSecondDurations(hoResult, 0, 0)

    expect(pncDisposal.exceptions).toStrictEqual([])
    expect(pncDisposal.value).toStrictEqual({
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
