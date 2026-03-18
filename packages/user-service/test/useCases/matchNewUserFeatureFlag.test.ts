import matchNewUserFeatureFlags from "useCases/matchNewUserFeatureFlags"

describe("matchNewUserFeatureFlags", () => {
  it("sets the default feature flags", () => {
    expect(matchNewUserFeatureFlags({})).toEqual({ httpsRedirect: true, exceptionsEnabled: false })
  })

  it("sets the default feature flags even if one exists", () => {
    expect(matchNewUserFeatureFlags({ httpsRedirect: true })).toEqual({ httpsRedirect: true, exceptionsEnabled: false })
  })

  it("will add current User's onlyAccessToNewBichard feature flag", () => {
    expect(matchNewUserFeatureFlags({ onlyAccessToNewBichard: true })).toEqual({
      httpsRedirect: true,
      exceptionsEnabled: false,
      onlyAccessToNewBichard: true
    })
  })

  it("will not add current User's onlyAccessToNewBichard feature flag if it's false", () => {
    expect(matchNewUserFeatureFlags({ onlyAccessToNewBichard: false })).toEqual({
      httpsRedirect: true,
      exceptionsEnabled: false
    })
  })
})
