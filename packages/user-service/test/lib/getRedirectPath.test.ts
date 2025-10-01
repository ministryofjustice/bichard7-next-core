import getValidRedirectPath from "lib/getRedirectPath"

describe("getValidRedirectPath()", () => {
  it("should return undefined when the query object does not have a redirect parameter", () => {
    const result = getValidRedirectPath({})
    expect(result).toBeUndefined()
  })

  it("should return undefined when redirect parameter is not an absolute path", () => {
    const redirect = "foobar"
    const result = getValidRedirectPath({ redirect })
    expect(result).toBeUndefined()
  })

  it("should return undefined when redirect parameter contains a URL", () => {
    const redirect = "http://example.com"
    const result = getValidRedirectPath({ redirect })
    expect(result).toBeUndefined()
  })

  it("should return undefined when redirect parameter contains invalid characters", () => {
    const redirect = "/foobar!"
    const result = getValidRedirectPath({ redirect })
    expect(result).toBeUndefined()
  })

  it("should return unmodified path when redirect parameter is valid", () => {
    const redirect = "/bichard-ui/InitialRefreshList"
    const result = getValidRedirectPath({ redirect })
    expect(result).toBe(redirect)
  })
})
