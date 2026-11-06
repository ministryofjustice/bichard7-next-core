import consistentSort from "./consistentSort"

describe("consistentSort", () => {
  it("should sort arrays of objects by ordered key", () => {
    const input = [
      { a: "a", b: "b", c: "c" },
      { c: "a", b: "b", a: "c" },
      { b: "a", a: "b", c: "c" }
    ]
    const sorted = consistentSort(input)
    expect(JSON.stringify(sorted)).toBe(
      '[{"a":"a","b":"b","c":"c"},{"a":"b","b":"a","c":"c"},{"a":"c","b":"b","c":"a"}]'
    )
  })
})
