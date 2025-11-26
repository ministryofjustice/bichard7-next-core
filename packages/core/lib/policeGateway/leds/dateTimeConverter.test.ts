import { convertDate, convertTime } from "./dateTimeConverter"

describe("dateTimeConverter", () => {
  describe("convertDate", () => {
    it("should convert PNC date format to LEDS date format", () => {
      const pncDate = "02092025"

      const ledsDate = convertDate(pncDate)

      expect(ledsDate).toBe("2025-09-02")
    })
  })

  describe("convertTime", () => {
    it("should convert PNC time format to LEDS time format", () => {
      const pncTime = "0102"

      const ledsTime = convertTime(pncTime)

      expect(ledsTime).toBe("01:02+00:00")
    })
  })
})
