import resolveBannerFirstShownDate from "./resolveBannerFirstShownDate"

describe("resolveBannerFirstShownDate", () => {
  it("returns date when resolveBannerFirstShownDate is called with date", () => {
    const infoBannerFirstShown = new Date()

    expect(resolveBannerFirstShownDate(infoBannerFirstShown)).toBe(infoBannerFirstShown)
  })

  it("returns undefined when resolveBannerFirstShownDate is not called with date", () => {
    expect(resolveBannerFirstShownDate()).toBeUndefined()
  })
})
