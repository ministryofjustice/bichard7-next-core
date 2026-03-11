import { addDays, format, startOfToday, subDays } from "date-fns"
import * as validator from "../../../src/features/ReportSelectionFilter/validation"

describe("Validation Utilities", () => {
  const today = startOfToday()

  describe("validateDateField", () => {
    it("should return error if date string is empty", () => {
      expect(validator.validateDateField("")).equal("This field is required")
    })

    it("should return error if date is more than 31 days ago", () => {
      const thirtyTwoDaysAgoStr = format(subDays(today, 32), "yyyy-MM-dd")
      expect(validator.validateDateField(thirtyTwoDaysAgoStr)).equal("Date should be within the last 31 days")
    })

    it("should return error if date is in the future", () => {
      const tomorrowStr = format(addDays(today, 1), "yyyy-MM-dd")
      expect(validator.validateDateField(tomorrowStr)).equal("Date cannot be in the future")
    })

    it("should return null for a valid date (today)", () => {
      const todayStr = format(today, "yyyy-MM-dd")
      expect(validator.validateDateField(todayStr)).equal(null)
    })
  })

  describe("validateDateRange", () => {
    it("should return errors if 'Date From' is after 'Date To'", () => {
      const pastDateStr = format(subDays(today, 1), "yyyy-MM-dd")
      const currentDateStr = format(today, "yyyy-MM-dd")

      const result = validator.validateDateRange(currentDateStr, pastDateStr)

      expect(result.fromError).equal(validator.DATE_CANNOT_BE_AFTER_DATE_TO)
      expect(result.toError).equal(validator.DATE_CANNOT_BE_BEFORE_DATE_FROM)
    })

    it("should return nulls for a valid range", () => {
      const todayStr = format(startOfToday(), "yyyy-MM-dd")
      const result = validator.validateDateRange(todayStr, todayStr)
      expect(result.fromError).equal(null)
      expect(result.toError).equal(null)
    })
  })

  describe("validateCheckboxes", () => {
    it("should return error if reportType is 'exceptions' but no boxes checked", () => {
      const result = validator.validateCheckboxes("exceptions", false, false)
      expect(result).equal("At least one option must be selected")
    })

    it("should return null if reportType is 'exceptions' and triggers is checked", () => {
      const result = validator.validateCheckboxes("exceptions", true, false)
      expect(result).equal(null)
    })

    it("should return null for other report types even if boxes are unchecked", () => {
      const result = validator.validateCheckboxes("bails", false, false)
      expect(result).equal(null)
    })
  })

  describe("validateSelectReport", () => {
    it("should return error if no report type selected", () => {
      expect(validator.validateSelectReport(undefined)).equal("This field is required")
    })

    it("should return null if report type is provided", () => {
      expect(validator.validateSelectReport("exceptions")).equal(null)
    })
  })
})
