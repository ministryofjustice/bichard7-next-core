import { bannerFirstShownDate, bannerForcesVisibleTo, bannerMessage } from "./infoBannerUtils"

describe("infoBannerUtils", () => {
  describe("bannerFirstShownDate", () => {
    it("returns date when called with a date argument", () => {
      const infoBannerFirstShown = new Date("2026-01-01T00:00:00Z")

      expect(bannerFirstShownDate(infoBannerFirstShown)).toBe(infoBannerFirstShown)
    })

    it("returns undefined when called without arguments", () => {
      expect(bannerFirstShownDate()).toBeUndefined()
    })
  })

  describe("bannerMessage", () => {
    it("returns message when called with a string", () => {
      const message = "Scheduled Maintenance at Midnight"

      expect(bannerMessage(message)).toBe(message)
    })

    it("returns undefined when called without arguments", () => {
      expect(bannerMessage()).toBeUndefined()
    })
  })

  describe("bannerForcesVisibleTo", () => {
    it("returns default forcesVisibleTo string when passed", () => {
      const visibleTo = "01"

      expect(bannerForcesVisibleTo(visibleTo)).toBe(visibleTo)
    })
  })
})
