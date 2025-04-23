import bannerFirstShownDate from "./bannerFirstShownDate"

describe("resolveBannerFirstShownDate", () => {
  it("returns date when resolveBannerFirstShownDate is called with date", () => {
    const infoBannerFirstShown = new Date()

    expect(bannerFirstShownDate(infoBannerFirstShown)).toBe(infoBannerFirstShown)
  })

  it("returns undefined when resolveBannerFirstShownDate is not called with date", () => {
    expect(bannerFirstShownDate()).toBeUndefined()
  })
})
