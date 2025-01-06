import untilFurtherOrderDisposalText from "./untilFurtherOrderDisposalText"

describe("check untilFurtherOrderDisposalText", () => {
  it("Strips out everything except UNTIL FURTHER ORDER", () => {
    const result = untilFurtherOrderDisposalText("Foo bar UNTIL FURTHER ORDER baz")

    expect(result).toBe("UNTIL FURTHER ORDER")
  })
  it("Returns empty string if no UNTIL FURTHER ORDER", () => {
    const result = untilFurtherOrderDisposalText("Foo bar UNTIL FURTHER baz")

    expect(result).toBe("")
  })
})
