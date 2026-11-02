import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"
import { isError } from "@moj-bichard7/common/types/Result"
import {
  SUSPENDED_SENTENCE_ORDER_RESULT_CODES,
  TRPR0031_RESULT_CODES
} from "@moj-bichard7/common/utils/triggerConstants"
import {
  addDurationToDate,
  formatDuration,
  getPleaStatus,
  getYesOrNo
} from "@moj-bichard7/common/utils/valueTransformers"

import type { CommunitySentenceRowReport } from "../../../types/reports/CommunitySentence"

import { dateOfBirth } from "../../cases/reports/utils/dateOfBirth"
import { defendantAddress } from "../../cases/reports/utils/defendantAddress"
import { formatDate } from "../../cases/reports/utils/formatDate"
import { caseToCommunitySentenceDto } from "./caseToCommunitySentenceReportDto"

jest.mock("@moj-bichard7/common/aho/parseHearingOutcome")
jest.mock("@moj-bichard7/common/types/Result")
jest.mock("@moj-bichard7/common/utils/valueTransformers")
jest.mock("../../cases/reports/utils/dateOfBirth")
jest.mock("../../cases/reports/utils/defendantAddress")
jest.mock("../../cases/reports/utils/formatDate")

describe("caseToCommunitySentenceDto", () => {
  const matchingResultCode = TRPR0031_RESULT_CODES[0]
  const nonMatchingResultCode = 99999
  const validNonMatchingResultCode = TRPR0031_RESULT_CODES[1]
  const suspendedResultCode = SUSPENDED_SENTENCE_ORDER_RESULT_CODES[0]

  const createMockAho = (offences: any[] = [], pncId?: null | string) => ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: offences,
            PNCIdentifier: pncId === undefined ? "2023/1234567A" : pncId
          }
        }
      }
    }
  })

  let mockRow: CommunitySentenceRowReport

  beforeEach(() => {
    jest.clearAllMocks()

    ;(isError as unknown as jest.Mock).mockImplementation((val) => val instanceof Error)
    ;(getYesOrNo as jest.Mock).mockImplementation((val) => (val ? "Yes" : "No"))
    ;(getPleaStatus as jest.Mock).mockImplementation((status) => status ?? "Not Guilty")
    ;(dateOfBirth as jest.Mock).mockReturnValue("01/01/1990")
    ;(defendantAddress as jest.Mock).mockReturnValue("Home address")
    ;(formatDate as jest.Mock).mockImplementation((date) => (date ? "10/05/2026" : ""))
    ;(formatDuration as jest.Mock).mockImplementation((length, unit) => `${length} ${unit}`)
    ;(addDurationToDate as jest.Mock).mockReturnValue(new Date("2027-05-10T00:00:00Z"))

    mockRow = {
      annotated_msg: "<xml>mock-aho</xml>",
      defendant_name: "Defendant name",
      domestic_violence_flag: true,
      error_id: 12345,
      msg_received_ts: new Date("2026-05-10T10:00:00Z"),
      triggers: []
    } as unknown as CommunitySentenceRowReport
  })

  it("should throw an error if parseHearingOutcome returns an error", () => {
    const parseErr = new Error("Failed to parse AHO XML")
    ;(parseHearingOutcome as jest.Mock).mockReturnValue(parseErr)

    expect(() => caseToCommunitySentenceDto(mockRow)).toThrow("Failed to parse AHO XML")
  })

  it("should filter out results not included in TRPR0031_RESULT_CODES", () => {
    const offences = [
      {
        OffenceTitle: "Offence title",
        Result: [
          { CJSresultCode: nonMatchingResultCode, PleaStatus: "Guilty" },
          { CJSresultCode: matchingResultCode, PleaStatus: "Guilty" }
        ]
      }
    ]
    ;(parseHearingOutcome as jest.Mock).mockReturnValue(createMockAho(offences))

    const results = caseToCommunitySentenceDto(mockRow)

    expect(results).toHaveLength(1)
    expect(results[0].resultCode).toBe(matchingResultCode)
  })

  it("should filter results based on provided result codes", () => {
    const offences = [
      {
        OffenceTitle: "Offence title",
        Result: [
          { CJSresultCode: matchingResultCode, PleaStatus: "Guilty" },
          { CJSresultCode: validNonMatchingResultCode, PleaStatus: "Guilty" }
        ]
      }
    ]
    ;(parseHearingOutcome as jest.Mock).mockReturnValue(createMockAho(offences))

    const results = caseToCommunitySentenceDto(mockRow, [matchingResultCode.toString()])

    expect(results).toHaveLength(1)
    expect(results[0].resultCode).toBe(matchingResultCode)
  })

  it("should correctly populate case and offence-level details", () => {
    const offences = [
      {
        ActualOffenceStartDate: { StartDate: new Date("2026-01-01") },
        ArrestDate: new Date("2026-01-02"),
        ChargeDate: new Date("2026-01-03"),
        ConvictionDate: new Date("2026-01-04"),
        LocationOfOffence: "Offence location",
        OffenceTitle: "Offence title",
        Result: [{ CJSresultCode: matchingResultCode, PleaStatus: "Guilty" }]
      }
    ]
    ;(parseHearingOutcome as jest.Mock).mockReturnValue(createMockAho(offences, "2026/000123A"))

    const results = caseToCommunitySentenceDto(mockRow)
    const dto = results[0]

    expect(dto.errorId).toBe(12345)
    expect(dto.defendantName).toBe("Defendant name")
    expect(dto.domesticViolenceFlag).toBe("Yes")
    expect(dto.pncId).toBe("2026/000123A")
    expect(dto.homeAddress).toBe("Home address")
    expect(dto.dateOfBirth).toBe("01/01/1990")
    expect(dto.offenceTitle).toBe("Offence title")
    expect(dto.offenceAddress).toBe("Offence location")
    expect(dto.plea).toBe("Guilty")
    expect(dto.resultCode).toBe(matchingResultCode)

    expect(dateOfBirth).toHaveBeenCalledTimes(1)
    expect(defendantAddress).toHaveBeenCalledTimes(1)
    expect(getYesOrNo).toHaveBeenCalledWith(true)
    expect(formatDate).toHaveBeenCalledWith(mockRow.msg_received_ts, false, true)
  })

  it("should handle missing or nullable optional fields gracefully", () => {
    mockRow.defendant_name = null as any
    mockRow.domestic_violence_flag = false

    const offences = [
      {
        ActualOffenceStartDate: undefined,
        ArrestDate: undefined,
        ChargeDate: undefined,
        ConvictionDate: undefined,
        LocationOfOffence: undefined,
        OffenceTitle: undefined,
        Result: [{ CJSresultCode: matchingResultCode, PleaStatus: undefined }]
      }
    ]
    ;(parseHearingOutcome as jest.Mock).mockReturnValue(createMockAho(offences, null))

    const results = caseToCommunitySentenceDto(mockRow)
    const dto = results[0]

    expect(dto.defendantName).toBeNull()
    expect(dto.domesticViolenceFlag).toBe("No")
    expect(dto.pncId).toBe("")
    expect(dto.offenceTitle).toBe("")
    expect(dto.offenceAddress).toBe("")
    expect(dto.arrestDate).toBe("")
    expect(dto.chargeDate).toBe("")
    expect(dto.dateOfSentence).toBe("")
    expect(dto.offenceStartDate).toBe("")
  })

  it("should calculate suspended sentence durations and expiry date for suspended sentence order codes", () => {
    const convictionDate = new Date("2026-02-01")
    const offences = [
      {
        ConvictionDate: convictionDate,
        OffenceTitle: "Assault Police",
        Result: [
          {
            CJSresultCode: suspendedResultCode,
            Duration: [
              { DurationLength: 6, DurationType: "Duration", DurationUnit: "m" },
              { DurationLength: 12, DurationType: "Suspended", DurationUnit: "m" }
            ],
            PleaStatus: "Guilty"
          }
        ]
      }
    ]
    ;(parseHearingOutcome as jest.Mock).mockReturnValue(createMockAho(offences))

    const results = caseToCommunitySentenceDto(mockRow)
    const dto = results[0]

    expect(formatDuration).toHaveBeenCalledWith(6, "m", true)
    expect(formatDuration).toHaveBeenCalledWith(12, "m", true)
    expect(addDurationToDate).toHaveBeenCalledWith(convictionDate, 12, "m")

    expect(dto.custodialSentenceDurationMonths).toBe("6 m")
    expect(dto.suspendedSentenceDurationMonths).toBe("12 m")
    expect(dto.expiryOfSentence).toBe("10/05/2026")
  })

  it("should default suspended sentence fields to empty strings when Duration is not provided", () => {
    const offences = [
      {
        ConvictionDate: new Date("2026-02-01"),
        OffenceTitle: "Possession with Intent",
        Result: [
          {
            CJSresultCode: suspendedResultCode,
            Duration: undefined,
            PleaStatus: "Not Guilty"
          }
        ]
      }
    ]
    ;(parseHearingOutcome as jest.Mock).mockReturnValue(createMockAho(offences))

    const results = caseToCommunitySentenceDto(mockRow)
    const dto = results[0]

    expect(dto.custodialSentenceDurationMonths).toBe("")
    expect(dto.suspendedSentenceDurationMonths).toBe("")
    expect(dto.expiryOfSentence).toBe("")
    expect(addDurationToDate).not.toHaveBeenCalled()
  })

  it("should flatten and return multiple DTOs when multiple matching results exist across offences", () => {
    const offences = [
      {
        OffenceTitle: "Offence 1",
        Result: [{ CJSresultCode: matchingResultCode }, { CJSresultCode: matchingResultCode }]
      },
      {
        OffenceTitle: "Offence 2",
        Result: [{ CJSresultCode: matchingResultCode }]
      }
    ]
    ;(parseHearingOutcome as jest.Mock).mockReturnValue(createMockAho(offences))

    const results = caseToCommunitySentenceDto(mockRow)

    expect(results).toHaveLength(3)
    expect(results[0].offenceTitle).toBe("Offence 1")
    expect(results[1].offenceTitle).toBe("Offence 1")
    expect(results[2].offenceTitle).toBe("Offence 2")
  })
})
