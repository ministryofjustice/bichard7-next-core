import { mergeClassNames } from "./mergeClassNames"

describe("mergeClassNames", () => {
  it("merges the 2 classNames", () => {
    const result = mergeClassNames("existing", "new")
    expect(result).toBe("existing new")
  })

  it("should handle adding multiple classNames", () => {
    const result = mergeClassNames("class1 class2", "class3 class4")
    expect(result).toBe("class1 class2 class3 class4")
  })

  it("handles new classNames being undefined", () => {
    const result = mergeClassNames("existing", undefined)
    expect(result).toBe("existing")
  })

  it("handles new classNames being empty", () => {
    const result = mergeClassNames("existing", "")
    expect(result).toBe("existing")
  })

  it("handles existing classNames being empty", () => {
    const result = mergeClassNames("", "new")
    expect(result).toBe("new")
  })

  it("should remove duplicate classNames", () => {
    const result = mergeClassNames("a b", "b c")
    expect(result).toBe("a b c")
  })
})
