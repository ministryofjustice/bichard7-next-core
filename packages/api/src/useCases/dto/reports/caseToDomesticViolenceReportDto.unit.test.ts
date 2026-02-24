import parseAhoXml from "@moj-bichard7/common/aho/parseAhoXml/parseAhoXml"
import { isError } from "@moj-bichard7/common/types/Result"
import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"

import type { CaseRowForDomesticViolenceReport } from "../../../types/reports/DomesticViolence"

import { caseToDomesticViolenceReportDto } from "./caseToDomesticViolenceReportDto"

jest.mock("@moj-bichard7/common/aho/parseAhoXml/parseAhoXml")
jest.mock("@moj-bichard7/common/types/Result")
jest.mock("@moj-bichard7/common/utils/getShortAsn")

describe("caseToDomesticViolenceReportDto", () => {
  const createMockAho = (offences: any[] = [], dob?: string) => ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            DefendantDetail: dob ? { BirthDate: dob } : undefined,
            Offence: offences
          }
        }
      }
    }
  })

  let mockRow: CaseRowForDomesticViolenceReport

  beforeEach(() => {
    jest.clearAllMocks()
    ;(isError as unknown as jest.Mock).mockImplementation((val) => val instanceof Error)
    ;(getShortAsn as jest.Mock).mockReturnValue("SHORT_ASN")

    mockRow = {
      annotated_msg: "<xml></xml>",
      asn: "LONG_ASN",
      court_date: new Date("2023-05-10T10:00:00Z"),
      court_name: "Test Court",
      defendant_name: "John Doe",
      ptiurn: "12345",
      trigger_codes: ["TRPR0024"]
    } as CaseRowForDomesticViolenceReport
  })

  it("should throw the error if AHO parsing fails", () => {
    const parseError = new Error("Invalid XML")
    ;(parseAhoXml as jest.Mock).mockReturnValue(parseError)
    ;(isError as unknown as jest.Mock).mockReturnValue(true)

    expect(() => [...caseToDomesticViolenceReportDto(mockRow)]).toThrow("Invalid XML")
  })

  it("should classify as 'Domestic Violence' if TRPR0023 is present", () => {
    mockRow.trigger_codes = ["TRPR0023", "TRPR0024"]
    ;(parseAhoXml as jest.Mock).mockReturnValue(createMockAho([{ OffenceTitle: "Assault" }]))

    const results = [...caseToDomesticViolenceReportDto(mockRow)]

    expect(results).toHaveLength(1)
    expect(results[0].type).toBe("Domestic Violence")
  })

  it("should classify as 'Vulnerable Victim' if TRPR0023 is absent", () => {
    mockRow.trigger_codes = ["TRPR0024"]
    ;(parseAhoXml as jest.Mock).mockReturnValue(createMockAho([{ OffenceTitle: "Theft" }]))

    const results = [...caseToDomesticViolenceReportDto(mockRow)]

    expect(results[0].type).toBe("Vulnerable Victim")
  })

  it("should format dates correctly and extract shared data", () => {
    ;(parseAhoXml as jest.Mock).mockReturnValue(createMockAho([{ OffenceTitle: "Speeding" }], "1990-12-25"))

    const results = [...caseToDomesticViolenceReportDto(mockRow)]
    const result = results[0]

    expect(result.hearingDate).toBe("10/05/2023")
    expect(result.dateOfBirth).toBe("25/12/1990")
    expect(result.courtName).toBe("Test Court")
    expect(result.defendantName).toBe("John Doe")
    expect(result.ptiurn).toBe("12345")
    expect(result.asn).toBe("SHORT_ASN")
    expect(getShortAsn).toHaveBeenCalledWith("LONG_ASN")
  })

  it("should gracefully handle missing or undefined fields", () => {
    mockRow.court_date = null as any
    mockRow.court_name = null
    mockRow.defendant_name = null
    mockRow.ptiurn = null
    ;(parseAhoXml as jest.Mock).mockReturnValue(createMockAho([{}]))

    const results = [...caseToDomesticViolenceReportDto(mockRow)]
    const result = results[0]

    expect(result.hearingDate).toBe("")
    expect(result.dateOfBirth).toBe("")
    expect(result.courtName).toBe("")
    expect(result.defendantName).toBe("")
    expect(result.ptiurn).toBe("")
    expect(result.offenceTitle).toBe("Unavailable")
  })

  it("should yield multiple rows when multiple offences exist", () => {
    const offences = [{ OffenceTitle: "Offence 1" }, { OffenceTitle: "Offence 2" }, { OffenceTitle: "Offence 3" }]
    ;(parseAhoXml as jest.Mock).mockReturnValue(createMockAho(offences))

    const results = [...caseToDomesticViolenceReportDto(mockRow)]

    expect(results).toHaveLength(3)
    expect(results[0].offenceTitle).toBe("Offence 1")
    expect(results[1].offenceTitle).toBe("Offence 2")
    expect(results[2].offenceTitle).toBe("Offence 3")
    expect(results[0].courtName).toEqual(results[1].courtName)
  })

  it("should aggregate outcome texts with newlines", () => {
    const offence = {
      OffenceTitle: "Aggravated Assault",
      Result: [{ ResultVariableText: "Guilty." }, { ResultVariableText: "Fined £500." }, { ResultVariableText: null }]
    }
    ;(parseAhoXml as jest.Mock).mockReturnValue(createMockAho([offence]))

    const results = [...caseToDomesticViolenceReportDto(mockRow)]

    expect(results[0].outcome).toBe("Guilty.\nFined £500.")
  })

  it("should truncate outcome text if it exceeds 1000 characters", () => {
    const textSnippet = "A".repeat(500)
    const offence = {
      OffenceTitle: "Long Case",
      Result: [
        { ResultVariableText: textSnippet },
        { ResultVariableText: textSnippet },
        { ResultVariableText: textSnippet }
      ]
    }
    ;(parseAhoXml as jest.Mock).mockReturnValue(createMockAho([offence]))

    const results = [...caseToDomesticViolenceReportDto(mockRow)]
    const outcome = results[0].outcome

    expect(outcome).toHaveLength(1000)
    expect(outcome.endsWith("[TEXT TRUNCATED - REFER TO REGISTER OR BICHARD 7 PORTAL]")).toBe(true)
    expect(outcome.startsWith("A".repeat(500) + "\n")).toBe(true)
  })
})
