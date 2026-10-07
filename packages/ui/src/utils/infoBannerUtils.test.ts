import { addDays, subDays } from "date-fns"
import type { ShouldDisplayInfoBannerParams } from "./infoBannerUtils"
import { bannerFirstShownDate, bannerForcesVisibleTo, bannerMessage, shouldDisplayInfoBanner } from "./infoBannerUtils"

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
      const message = "There are new features available on new Bichard."

      expect(bannerMessage(message)).toBe(message)
    })
  })

  describe("bannerForcesVisibleTo", () => {
    it("returns forcesVisibleTo string", () => {
      const visibleTo = "01"

      expect(bannerForcesVisibleTo(visibleTo)).toBe(visibleTo)
    })

    it("returns empty string when 'ALL' passed", () => {
      const visibleTo = "ALL"

      expect(bannerForcesVisibleTo(visibleTo)).toBe("")
    })
  })

  describe("shouldDisplayInfoBanner", () => {
    const defaultParams: ShouldDisplayInfoBannerParams = {
      message: "Test message",
      userVisibleForces: ["01"],
      forcesFilter: new Set(["01", "02"]),
      firstShownDate: subDays(new Date(), 1),
      lifespanDays: 7
    }

    describe("Message validation", () => {
      it("returns false if message is empty", () => {
        expect(shouldDisplayInfoBanner({ ...defaultParams, message: "" })).toBe(false)
      })

      it("returns false if message is undefined", () => {
        expect(shouldDisplayInfoBanner({ ...defaultParams, message: undefined })).toBe(false)
      })

      it("returns true if message is provided", () => {
        expect(shouldDisplayInfoBanner({ ...defaultParams })).toBe(true)
      })
    })

    describe("Force filtering", () => {
      it("returns true when user belongs to one of the allowed forces in forcesFilter", () => {
        const result = shouldDisplayInfoBanner({
          ...defaultParams,
          forcesFilter: new Set(["01", "02"]),
          userVisibleForces: ["01"]
        })
        expect(result).toBe(true)
      })

      it("returns false when user does not belong to any force in forcesFilter", () => {
        const result = shouldDisplayInfoBanner({
          ...defaultParams,
          forcesFilter: new Set(["01", "02"]),
          userVisibleForces: ["03"]
        })
        expect(result).toBe(false)
      })

      it("returns true when forcesFilter set is empty", () => {
        const result = shouldDisplayInfoBanner({
          ...defaultParams,
          forcesFilter: new Set(),
          userVisibleForces: ["01"]
        })
        expect(result).toBe(true)
      })
    })

    describe("Date and lifespan validation", () => {
      beforeEach(() => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date("2026-10-07T12:00:00Z"))
      })

      afterEach(() => {
        jest.useRealTimers()
      })

      it("returns false if firstShownDate is missing or undefined", () => {
        expect(shouldDisplayInfoBanner({ ...defaultParams, firstShownDate: undefined })).toBe(false)
      })

      it("returns false when firstShownDate is in the future", () => {
        const futureDate = addDays(new Date(), 2)
        const result = shouldDisplayInfoBanner({
          ...defaultParams,
          firstShownDate: futureDate
        })
        expect(result).toBe(false)
      })

      it("returns false when the banner has passed its lifespan", () => {
        const startDate = subDays(new Date(), 10)
        const result = shouldDisplayInfoBanner({
          ...defaultParams,
          firstShownDate: startDate,
          lifespanDays: 7
        })
        expect(result).toBe(false)
      })

      it("returns true when banner was created on the current day", () => {
        const result = shouldDisplayInfoBanner({
          ...defaultParams,
          firstShownDate: new Date("2026-10-07T08:00:00Z")
        })
        expect(result).toBe(true)
      })

      it("returns true on the exact final boundary day of its lifespan", () => {
        const startDate = subDays(new Date(), 7)
        const result = shouldDisplayInfoBanner({
          ...defaultParams,
          firstShownDate: startDate,
          lifespanDays: 7
        })
        expect(result).toBe(true)
      })
    })
  })
})
