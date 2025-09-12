jest.mock("./getFirstDateSpecifiedInResult")
jest.mock("../getDisposalTextFromResult")
jest.mock("./isDriverDisqualificationResult")

import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { getDisposalTextFromResult } from "../getDisposalTextFromResult"
import createPoliceDisposalByFirstAndSecondDurations from "./createPoliceDisposalByFirstAndSecondDurations"
import getFirstDateSpecifiedInResult from "./getFirstDateSpecifiedInResult"
import isDriverDisqualificationResult from "./isDriverDisqualificationResult"

const mockedGetFirstDateSpecifiedInResult = getFirstDateSpecifiedInResult as jest.Mock
const mockedGetDisposalTextFromResult = getDisposalTextFromResult as jest.Mock
const mockedIsDriverDisqualificationResult = isDriverDisqualificationResult as jest.Mock

describe("createPoliceDisposalByFirstAndSecondDurations", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should return a disposal when disposal text has value and is valid", () => {
    const hoResult = {
      ResultQualifierVariable: [] as unknown,
      AmountSpecifiedInResult: [{ Amount: 11 }],
      Duration: [
        { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
        { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
      ]
    } as Result

    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(false)
    mockedGetDisposalTextFromResult.mockReturnValue("Dummy disposal text")

    const disposal = createPoliceDisposalByFirstAndSecondDurations(hoResult)

    expect(disposal).toStrictEqual({
      qtyDate: "10052024",
      qtyDuration: "D3",
      qtyMonetaryValue: "11",
      qtyUnitsFined: "D3          0000011.0000",
      qualifiers: "        H5",
      text: "Dummy disposal text",
      type: undefined
    })
  })

  it("should return a disposal when ResultVariableText has value and is valid", () => {
    const hoResult = {
      ResultVariableText: "Dummy text",
      ResultQualifierVariable: [] as unknown,
      AmountSpecifiedInResult: [{ Amount: 11 }],
      Duration: [
        { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
        { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
      ]
    } as Result

    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(false)
    mockedGetDisposalTextFromResult.mockReturnValue("A".repeat(65))

    const disposal = createPoliceDisposalByFirstAndSecondDurations(hoResult)

    expect(disposal).toStrictEqual({
      qtyDate: "10052024",
      qtyDuration: "D3",
      qtyMonetaryValue: "11",
      qtyUnitsFined: "D3          0000011.0000",
      qualifiers: "        H5",
      text: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+",
      type: undefined
    })
  })

  it("should return a disposal and validate disposal text when disposal text has value and is valid", () => {
    const hoResult = {
      ResultQualifierVariable: [] as unknown,
      AmountSpecifiedInResult: [{ Amount: 11 }],
      Duration: [
        { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
        { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
      ]
    } as Result

    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(false)
    mockedGetDisposalTextFromResult.mockReturnValue("Dummy disposal text")

    const disposal = createPoliceDisposalByFirstAndSecondDurations(hoResult)

    expect(disposal).toStrictEqual({
      qtyDate: "10052024",
      qtyDuration: "D3",
      qtyMonetaryValue: "11",
      qtyUnitsFined: "D3          0000011.0000",
      qualifiers: "        H5",
      text: "Dummy disposal text",
      type: undefined
    })
  })

  it("should return a disposal and use DateSpecifiedInResult for disposal text when there's no disposal text and is driver disqualification", () => {
    const hoResult = {
      ResultQualifierVariable: [] as unknown,
      AmountSpecifiedInResult: [{ Amount: 11 }],
      Duration: [
        { DurationType: "Duration", DurationUnit: "D", DurationLength: 3 },
        { DurationType: "Suspended", DurationUnit: "H", DurationLength: 5 }
      ]
    } as Result

    mockedGetFirstDateSpecifiedInResult.mockReturnValue(new Date("2024-05-10"))
    mockedIsDriverDisqualificationResult.mockReturnValue(true)
    mockedGetDisposalTextFromResult.mockReturnValue(undefined)

    const disposal = createPoliceDisposalByFirstAndSecondDurations(hoResult)

    expect(disposal).toStrictEqual({
      qtyDate: "",
      qtyDuration: "D3",
      qtyMonetaryValue: "11",
      qtyUnitsFined: "D3          0000011.0000",
      qualifiers: "        H5",
      text: "from 10/05/24",
      type: undefined
    })
  })
})
