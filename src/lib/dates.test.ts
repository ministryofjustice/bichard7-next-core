import { toISODate, toPNCDate } from "./dates"

describe("date processing", () => {
  describe("toISODate()", () => {
    it("should output the date part of the ISO string", () => {
      const dateString = "2022-07-01"
      const date = new Date(dateString)
      const output = toISODate(date)
      expect(output).toBe(dateString)
    })

    it("should output the date part of the ISO string for a very old date", () => {
      const dateString = "1011-07-01"
      const date = new Date(dateString)
      const output = toISODate(date)
      expect(output).toBe(dateString)
    })
  })

  describe("toPNCDate()", () => {
    it("should output the date part of the ISO string", () => {
      const date = new Date("2022-07-01")
      const output = toPNCDate(date)
      expect(output).toBe("01072022")
    })

    it("should output the date part of the ISO string for a very old date", () => {
      const date = new Date("1011-07-01")
      const output = toPNCDate(date)
      expect(output).toBe("01071011")
    })
  })
})
