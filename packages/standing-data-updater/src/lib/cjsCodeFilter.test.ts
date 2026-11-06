import cjsCodeFilter from "./cjsCodeFilter"

describe("cjsCodeFilter", () => {
  it("should include valid CJS Code", () => {
    const cjsCode = "ABC1234"
    expect(cjsCodeFilter(cjsCode)).toBe(true)
  })
  it("should exclude CJS Code with too few characters", () => {
    const cjsCode = "AB1"
    expect(cjsCodeFilter(cjsCode)).toBe(false)
  })
  it("should exclude CJS Code with too many characters", () => {
    const cjsCode = "ABC123456789"
    expect(cjsCodeFilter(cjsCode)).toBe(false)
  })
})
