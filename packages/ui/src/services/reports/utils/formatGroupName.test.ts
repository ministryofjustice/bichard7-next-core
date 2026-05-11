import { formatGroupName } from "./formatGroupName"
import parseDate from "utils/parseDate"
import { format } from "date-fns"
import type { GroupedReportConfig } from "@/types/reports/Config"

jest.mock("utils/parseDate", () => jest.fn())
jest.mock("date-fns", () => ({
  format: jest.fn()
}))

type MockConfig = GroupedReportConfig<Record<string, never>, never>

describe("formatGroupName", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should format and return a date string when the formatter config is 'date'", () => {
    const mockParsedDate = new Date("2026-05-08T12:00:00Z")
    ;(parseDate as jest.Mock).mockReturnValue(mockParsedDate)
    ;(format as jest.Mock).mockReturnValue("08/05/2026")

    const config = { formatter: "date" } as MockConfig

    const result = formatGroupName(config, "2026-05-08")

    expect(parseDate).toHaveBeenCalledWith("2026-05-08", "yyyy-MM-dd", expect.any(Date))
    expect(format).toHaveBeenCalledWith(mockParsedDate, "dd/MM/yyyy")
    expect(result).toBe("08/05/2026")
  })

  it("should return the raw group name when no formatter is provided", () => {
    const config = {} as MockConfig

    const result = formatGroupName(config, "Court Room 1")

    expect(parseDate).not.toHaveBeenCalled()
    expect(format).not.toHaveBeenCalled()
    expect(result).toBe("Court Room 1")
  })

  it("should return the raw group name when the formatter does not match 'date'", () => {
    const config = { formatter: "currency" } as unknown as MockConfig

    const result = formatGroupName(config, "1000")

    expect(parseDate).not.toHaveBeenCalled()
    expect(format).not.toHaveBeenCalled()
    expect(result).toBe("1000")
  })
})
